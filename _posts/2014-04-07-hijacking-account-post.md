---
layout: post
title: Hijacking account via XSS
description: "A simple proof of concept on how to steal account via XSS vulnerability"
tags: [xss, hacking, exploitation]
comments: true
---

[Cross-Site Scripting (XSS)]https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted web sites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user. Flaws that allow these attacks to succeed are quite widespread and occur anywhere a web application uses input from a user within the output it generates without validating or encoding it.

An attacker can use XSS to send a malicious script to an unsuspecting user. The end user’s browser has no way to know that the script should not be trusted, and will execute the script. Because it thinks the script came from a trusted source, the malicious script can access any cookies, session tokens, or other sensitive information retained by the browser and used with that site. These scripts can even rewrite the content of the HTML page.

### Sniff like a dog

Before initiating a pentest, I normally play with the application first. I use different tools to watch the traffic. I take down notes of things I'm very interested such as changing password, updating profile, uploading attachments, etc. You have too scrutinize the traffic of the request that was generated. You have to think harder, generate flows on your head by asking yourself with "what if I bypass this/that", etc.

### Let's start the exploitation

