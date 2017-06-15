---
title: استفاده از اکانت Gmail در ترمینال لینوکس
author: علی موسوی
date: 2010-04-03
tags: لینوکس, خط فرمان
description: تنظیم gmail و mutt برای مرور ای‌میل‌ها در ترمینال لینوکس
mathjax: false
template: article.jade
---

این پست یک راهنما برای استفاده از Mutt به همراه fetchmail و procmail و msmtp جهت فرستادن، دریافت کردن و خواندن ای‌میل در ترمینال لینوکس و با استفاده از اکانت جی میل است. اگر این سوال براتون پیش اومده که چرا یک نفر باید برای انجام چنین کاری وقت بذاره و طبق معمول از یک مرورگر اینترنت برای دریافت یا ارسال ای‌میل‌ها استفاده نکنه، احتمالا این پست برای شما نیست.

اما فکر می کنم همه شما تا الان قدرت شگفت‌انگیز ترمینال لینوکس رو حس کرده‌اید، اگر اینطوره حتما از این مطلب خوشتون میاد.

<span class="more"></span>

بیشتر این نوشته برگرفته از نوشته‌ی اندرو استرانگ (Andrew Strong)، با عنوان [Using Mutt with Gmail](http://www.andrews-corner.org/mutt.html) است که در اینجا از ایشون که به من این اجازه رو دادن که از نوشته‌شون استفاده کنم و این متن رو در اینجا بنویسم تشکر می‌کنم.

## پیش از شروع ##

باید دقت کنید که بخش‌هایی از کدها که شامل نام‌کاربری، ای‌میل و یا پسورد می‌باشد باید با اطلاعات شما جایگزین شود.

## بخش یک: دانلود ای‌میل‌ها ##

احتمالا این بخش پیچیده‌ترین بخش این مطلب باشه ولی بهتون اطمینان می‌دم که به سختیش می‌ارزه!

در ابتدا باید مجوز‌های SSL ٬(SSL Certificates) لازم رو دانلود و نصب کرد، سپس باید fetchmail رو نصب کرد و در آخر می باید procmail رو نصب کنیم.

### دانلود SSL Certificate ###

از اونجا که احتمال داره مجوزهای جی‌میل پس از یک دوره‌ی زمانی (معمولا طولانی) عوض بشن من در اینجا روشی برای اینکه مجوزها رو خودتون از موزیلا (Mozilla's source tree) و با استفاده از اسکریپت دانیل استنبرگ (Daniel Stenberg) دانلود کنید، معرفی می‌کنم.
برای اجرای این اسکریپت باید `perl` و همچنین ماژول‌های `perl-libwww` رو نصب کرده باشید.

```bash
$ mkdir -pv $HOME/mail/certs
$ cd $HOME/mail/certs
$ touch Thawte_Premium_Server_CA.pem
$ touch Equifax_Secure_CA.pem
$ curl --verbose --output mk-ca-bundle.pl \
http://cool.haxx.se/cvs.cgi/*checkout*/curl/lib/mk-ca-bundle.pl?rev=1.10
$ perl mk-ca-bundle.pl
```

این کد باعث می‌شه یک فایل به اسم `ca-bundle.crt` ایجاد بشه که شما باید دو مجوز از درون این فایل استخراج کنید. اولین مجوز "Thawte Premium Server CA" است که باید در فایل مربوط به خودش که چند لحظه پیش ساختیم یعنی `Thawte_Premium_Server_CA.pem` ذخیره بشه. من این مجوز رو اینجا برای کسانی که با اسکریپت perl مشکل دارن می‌ذارم ولی بهتره که خودتون این مجوز رو بدست بیارین:

```bash
-----BEGIN CERTIFICATE-----
MIIDJzCCApCgAwIBAgIBATANBgkqhkiG9w0BAQQFADCBzjELMAkGA1UEBhMCWkExFTATBgNVBAgT
DFdlc3Rlcm4gQ2FwZTESMBAGA1UEBxMJQ2FwZSBUb3duMR0wGwYDVQQKExRUaGF3dGUgQ29uc3Vs
dGluZyBjYzEoMCYGA1UECxMfQ2VydGlmaWNhdGlvbiBTZXJ2aWNlcyBEaXZpc2lvbjEhMB8GA1UE
AxMYVGhhd3RlIFByZW1pdW0gU2VydmVyIENBMSgwJgYJKoZIhvcNAQkBFhlwcmVtaXVtLXNlcnZl
ckB0aGF3dGUuY29tMB4XDTk2MDgwMTAwMDAwMFoXDTIwMTIzMTIzNTk1OVowgc4xCzAJBgNVBAYT
AlpBMRUwEwYDVQQIEwxXZXN0ZXJuIENhcGUxEjAQBgNVBAcTCUNhcGUgVG93bjEdMBsGA1UEChMU
VGhhd3RlIENvbnN1bHRpbmcgY2MxKDAmBgNVBAsTH0NlcnRpZmljYXRpb24gU2VydmljZXMgRGl2
aXNpb24xITAfBgNVBAMTGFRoYXd0ZSBQcmVtaXVtIFNlcnZlciBDQTEoMCYGCSqGSIb3DQEJARYZ
cHJlbWl1bS1zZXJ2ZXJAdGhhd3RlLmNvbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA0jY2
aovXwlue2oFBYo847kkEVdbQ7xwblRZH7xhINTpS9CtqBo87L+pW46+GjZ4X9560ZXUCTe/LCaIh
Udib0GfQug2SBhRz1JPLlyoAnFxODLz6FVL88kRu2hFKbgifLy3j+ao6hnO2RlNYyIkFvYMRuHM/
qgeN9EJN50CdHDcCAwEAAaMTMBEwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQQFAAOBgQAm
SCwWwlj66BZ0DKqqX1Q/8tfJeGBeXm43YyJ3Nn6yF8Q0ufUIhfzJATj/Tb7yFkJD57taRvvBxhEf
8UqwKEbJw8RCfbz6q1lu1bdRiBHjpIUZa4JMpAwSremkrj/xw0llmozFyD4lt5SZu5IycQfwhl7t
UCemDaYj+bvLpgcUQg==
-----END CERTIFICATE-----
```

دومین مجوز "Equifax Secure CA" است که اون هم باید در فایل مربوط به خودش یعنی `Equifax_Secure_CA.pem` ذخیره بشه:

```bash
-----BEGIN CERTIFICATE-----
MIIDIDCCAomgAwIBAgIENd70zzANBgkqhkiG9w0BAQUFADBOMQswCQYDVQQGEwJVUzEQMA4GA1UE
ChMHRXF1aWZheDEtMCsGA1UECxMkRXF1aWZheCBTZWN1cmUgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
MB4XDTk4MDgyMjE2NDE1MVoXDTE4MDgyMjE2NDE1MVowTjELMAkGA1UEBhMCVVMxEDAOBgNVBAoT
B0VxdWlmYXgxLTArBgNVBAsTJEVxdWlmYXggU2VjdXJlIENlcnRpZmljYXRlIEF1dGhvcml0eTCB
nzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAwV2xWGcIYu6gmi0fCG2RFGiYCh7+2gRvE4RiIcPR
fM6fBeC4AfBONOziipUEZKzxa1NfBbPLZ4C/QgKO/t0BCezhABRP/PvwDN1Dulsr4R+AcJkVV5MW
8Q+XarfCaCMczE1ZMKxRHjuvK9buY0V7xdlfUNLjUA86iOe/FP3gx7kCAwEAAaOCAQkwggEFMHAG
A1UdHwRpMGcwZaBjoGGkXzBdMQswCQYDVQQGEwJVUzEQMA4GA1UEChMHRXF1aWZheDEtMCsGA1UE
CxMkRXF1aWZheCBTZWN1cmUgQ2VydGlmaWNhdGUgQXV0aG9yaXR5MQ0wCwYDVQQDEwRDUkwxMBoG
A1UdEAQTMBGBDzIwMTgwODIyMTY0MTUxWjALBgNVHQ8EBAMCAQYwHwYDVR0jBBgwFoAUSOZo+SvS
spXXR9gjIBBPM5iQn9QwHQYDVR0OBBYEFEjmaPkr0rKV10fYIyAQTzOYkJ/UMAwGA1UdEwQFMAMB
Af8wGgYJKoZIhvZ9B0EABA0wCxsFVjMuMGMDAgbAMA0GCSqGSIb3DQEBBQUAA4GBAFjOKer89961
zgK5F7WF0bnj4JXMJTENAKaSbn+2kmOeUJXRmm/kEd5jhW6Y7qj/WsjTVbJmcVfewCHrPSqnI0kB
BIZCe/zuf6IWUrVnZ9NA2zsmWLIodz2uFHdh1voqZiegDfqnc1zqcPGUIWVEX/r87yloqaKHee95
70+sB3c4
-----END CERTIFICATE-----
```

و در آخر با استفاده از کد زیر کاری کنید که `openssl` بدونه کجا دنبال مجوزها بگرده:
```bash
$ c_rehash $HOME/mail/certs/
```

با این کار بخش مربوط به دانلود مجوزها تموم می‌شه و ما الان آماده‌ایم که به سراغ بخش نصب fetchmail بریم.

### نصب fetchmail ###
 
الان که موفق شدیم مجوزهای SSL رو دانلود کنیم، `fetchmail` به راحتی قابل نصب و استفاده است. باید فایل ‭`$Home/fetchmailrc` ‬ رو با اطلاعات زیر ایجاد کنید:

```bash
poll pop.gmail.com
with proto POP3
user 'your.email@gmail.com'
there with password 'your_password'
is 'your_user_name' here
mda "/usr/bin/procmail -d %T"
options
no keep
ssl
sslcertck
sslcertpath /home/your_username/mail/certs/
```
واضحه که می‌باید اطلاعات مربوط به خودتون رو جایگزین قسمت‌های مربوطه کنید.
و در آخر، از اونجا که کلمه‌ی عبور شما در این فایل ذخیره شده، بهتره که فقط به صاحب فایل، مجوز دسترسی و خوندنش رو بدید:

```bash
$ chmod 600 ~/.fetchmailrc
```

الان زمان مناسبیه برای اینکه مطمئن بشید که POP Forwarding رو در اکانت جی‌میلتون فعال کرده‌اید. این تنظیمات رو می‌تونید در قسمت Settings - Forwarding and POP جی‌میل پیدا کنید. بعد از اینکه تنظیمات مورد نظر خودتون رو اعمال کردید، به مرحله‌ی بعد برید.

### نصب procmail ###

`procmail` آخرین مرحله از بخش دانلود ای‌میل‌هاست. قبل از نصب اون باید متغیر 
محیطی ‭$MAIL‬ رو تعریف کنید تا تمام نرم‌افزارهای مربوط به ای‌میل بدونن محل ذخیره‌ی ای‌میل‌ها کجاست. دو خط زیر رو به `bashrc./~` اضافه کنید:

```bash
# Sets the Mail Environment Variable
MAIL=/var/spool/mail/john && export MAIL>/code>
```

بعد از انجام این‌کار باید فایل `‭$HOME/.procmailrc‬` رو به همراه تنظیمات مورد نظرتون ایجاد کنید. من یک نمونه‌ی ساده از تنظیمات `procmail` رو در زیر می‌آرم که شما می‌تونید در صورت تمایل پس از خوندن راهنمای `procmail` تغییرش بدین:

```bash
PATH=/bin:/usr/bin:/usr/local/bin
VERBOSE=off 
DEFAULT=/var/spool/mail/your_username
MAILDIR=$HOME/mail
LOGFILE=$HOME/.procmaillog
# Recipes below this comment:

:0:
* ^TOmutt-user
mutt
```

البته بخش آخر فایل تنها یک مثال ساده است که می‌تونه حذف بشه. فعلا توضیحی در مورد اون نمی‌دم چون شما بعد از خوندن راهنمای `procmail` متوجه کاربردش خواهید شد. حتما `man procmailex` رو اجرا کنید تا متوجه تنظیمات بالا بشید. البته فراموش نکنید که در تنظیمات بالا اطلاعات مربوط به خودتون رو جایگزین قسمت مربوطه کنید.

## بخش دو: فرستادن ای‌میل ##

در این بخش از نرم‌افزار `msmtp` برای فرستادن ای‌میل استفاده ‌می‌کنیم. برای نصب `msmtp` می‌بایست فایل `‭$HOME/.msmtprc‬` رو با اطلاعات زیر ایجاد کنید:

```bash
account default
host smtp.gmail.com
port 587
from your_email@gmail.com
tls on
tls_starttls on
tls_trust_file /home/john/mail/certs/Thawte_Premium_Server_CA.pem
# tls_trust_file /home/john/mail/certs/Equifax_Secure_CA.pem
auth on
user your_email
password your_password
logfile ~/.msmtp.log 
```

البته فراموش نکنید که قسمت‌های مربوطه رو با اطلاعات مربوط به خودتون تغویض کنید و از اونجا که باز هم در این فایل پسورد شما ذخیره شده، باید کاری کنید که فایل فقط توسط صاحب اون خونده بشه:

```bash
$ chmod 600 ~/.msmtprc
```
و بالاخره Mutt:

## بخش سه: خواندن ای‌میل‌ها ##

برای تنظیم Mutt باید فایل `‭$HOME/.muttrc‬` رو ایجاد و تنظیمات مورد نیازتون رو به اون اضافه کنید. تنظیم Mutt کار نسبتا زمان بریه و اگر بخواید این فایل رو از هیچ بنویسید، ممکنه خسته بشید. من برای شروع یک نمونه‌ی ساده از این تنظیمات رو می‌ذارم که شما می‌تونید بعداً اون رو به هر شکلی که دوست دارید، تغییر بدید. بعضی قسمت‌های این فایل مثل aliasها و رنگ‌ها (colours) به فایل‌ دیگه‌ای اشاره می‌کنن که نباید یادتون بره اون فایل‌ها رو هم ایجاد کنید.
```bash
#======================================================#
# Boring details
set realname = "your_username"
set from = "your_email@gmail.com"
set use_from = yes
set envelope_from ="yes"

# Use a signature
set signature="~/.signature"

# Use msmtp rather than sendmail. Check that
# the path is correct for your system:
set sendmail="/usr/bin/msmtp"  

# If not set in ~/.bashrc:
set spoolfile = /var/spool/mail/john

#======================================================#
# Folders
set folder="$HOME/mail"      # Local mailboxes stored here
set record="+sent"           # Where to store sent messages
set postponed="+postponed"   # Where to store draft messages
set mbox_type=mbox           # Mailbox type
set move=no                  # Don't move mail from spool

#======================================================#
# Watch these mailboxes for new mail, useful only if
# Procmail or Maildrop is used to sort mail.
mailboxes ! +slrn +fetchmail +mutt
set sort_browser=alpha    # Sort mailboxes by alpha(bet)

#======================================================#
# What to show and order of headers
ignore *
unignore Date: From: User-Agent: X-Mailer X-Operating-System To: \
Cc: Reply-To: Subject: Mail-Followup-To:
hdr_order Date: From: User-Agent: X-Mailer X-Operating-System To: \
Cc: Reply-To: Subject: Mail-Followup-To:

#======================================================#
# which editor do you want to use?
# vim of course!
set editor="vim -c 'set tw=70 et' '+/^$' "
set edit_headers=yes      # See the headers when editing

#======================================================#
# Aliases

set alias_file = ~/mail/mutt_aliases # In their own file
source ~/mail/mutt_aliases           # Source them
set sort_alias=alias                 # Sort alphabetically

#======================================================#
# Colours: defaults are a little bleak so experiment!

source ~/mutt/mutt_colors            # In their own file

#======================================================#
# Lists: An example using the mutt-users list:

lists mutt-users
subscribe mutt-users
set followup_to=yes        # Sets 'Mail-Followup-To' header
set honor_followup_to=yes 
fcc-hook mutt-user +mutt   # See your own posts using fcc

#======================================================#
# Odds and ends

set markers          # mark wrapped lines of text in the pager with a +
set smart_wrap       # Don't wrap mid-word
set pager_context=5  # Retain 5 lines of previous page when scrolling.
set status_on_top    # Status bar on top.
push <show-version>  # Shows mutt version at startup
```

در زیر توضیحات بیشتری در مورد رنگ‌ها و روش استفاده از اون‌ها در Mutt می‌دم:

### رنگ‌ها در Mutt ###

اگر ترمینال شما از رنگ‌ها هم پشتیبانی می‌کنه (که دیگه این روزا خیلی کم پیش می‌یاد که ترمینالی از رنگ‌ها پشتیبانی نکنه)، می‌تونید تقریبا رنگ همه‌ی قسمت‌های پنجره‌ی Mutt رو تنظیم کنید. تمام اطلاعات مربوط به رنگ‌ها در راهنمای Mutt و در قسمت "Section 3: Configuration 8: Using color and mono video attributes" موجوده، ولی در هر حال، روش ساده‌ی استفاده از رنگ‌ها به صورت زیره:

```bash
color   object   foreground   background>/code>
```

البته تعیین رنگ‌ها می‌تونه خیلی پیچیده‌تر از این‌ها باشه، ولی یک شروع ساده مناسب‌تره. رنگ‌های اولیه شامل سفید (white)، سیاه (black)، سبز (green)، بنفش (magenta)، آبی (blue)، فیروزه‌ای (cyan)، زرد (yellow)، قرمز (red) و رنگ پیش‌فرض (default) است که همین‌طور می‌تونید با اضافه کردن کلمه‌ی bright در مورد رنگ‌های پس‌زمینه (foreground) اون‌ها رو پر رنگ‌تر کنید. برای افرادی که از ترمینالی با پیش‌زمینه‌ی سفید استفاده می‌کنن، رنگ‌های زیر رنگ‌های مناسبی هستن:

```bash
#---- Mutt Colors for White Background -------
color    hdrdefault    black           default  
color    quoted        red             default  
color    signature     brightblack     default  
color    indicator     brightwhite     red
color    attachment    black           default
color    error         red             default  
color    message       blue            default  
color    search        brightwhite     magenta
color    status        brightyellow    blue
color    tree          red             default  
color    normal        blue            default  
color    tilde         green           default  
color    bold          brightyellow    default  
color    markers       red             default
```

البته باید فایلی به اسم `colors.default` هم به هنگام نصب Mutt ایجاد شده باشه که برای ترمینال‌هایی با پیش‌زمینه‌ی سفید نوشته شده. برای ترمینال‌هایی که دارای پیش‌زمینه‌ی سیاه رنگ هستند هم فایلی به نام `colors.linux` به هنگام نصب Mutt ایجاد شده که محتویات این فایل در زیر اومده:

```bash
#---- Mutt Colors for Black Background -------
color   hdrdefault   blue              black
color   quoted       blue              black
color   signature    blue              black
color   attachment   red               black
color   message      brightred         black
color   error        brightred         black
color   indicator    black             red
color   status       brightgreen       blue
color   tree         white             black
color   normal       white             black
color   markers      red               black
color   search       white             black
color   tilde        brightmagenta     black
color   index        blue              black ~F
color   index        red               black "~N|~O"
```

اگر هم از هیچ‌‌کدوم از رنگ‌های بالا خوشتون نیامد، می‌تونید خودتون دست بکار بشید و با کمک راهنمای Mutt رنگ‌های مورد علاقه‌تون رو انتخاب کنید.

## نتیجه‌ی کار ##

در نهایت، شما می‌تونید بعد از باز کردن Mutt، با فشار دادن کلید `!` یک شل پرامت (shell prompt) باز کنید و پس از اجرای کامند `fetchmail -v` خواندن ای‌میل‌هاتون رو شروع کنید. و هدیه‌‌ای که من در اینجا به شما می‌دم یک ماکروست که با استفاده از اون می‌تونید به راحتی و با فشردن کلید `I` به خواندن ای‌میل‌ها بپردازید. خط زیر رو به `muttrc./~` اضافه کنید:

```bash
macro index,pager I '<shell-escape> fetchmail -v<enter>'
```

البته این فایل `Muttrc./~` خیلی ساده است و می‌تونه پیچیده‌تر از این‌ها باشه، اما به نظر من این فایل بیشتر نیازها رو بر آورده می‌کنه. از اینکه چند ساعتی بیشتر وقت بذارید و این فایل رو کامل‌تر کنید نترسید، چون قطعا کامل‌تر کردنش ارزش زمانی رو که براش می‌ذارید رو داره.

### و در انتها... ###
 
ترمینال لینوکس برنامه‌های خارق‌العاده‌ای داره و می‌شه باهاش کارهای عجیب غریبی انجام داد. اسکریپت‌های زیادی می‌شه نوشت که نتیجه‌ی اون‌ها رو ای‌میل کنه، و یا ای‌میلی رو که دریافت شده رو بگیره و کار خاصی روی اون انجام بده. به هر حال امیدوارم از این نوشته بهره‌ی کافی رو برده باشید و خیلی خوشحال می‌شم اگر نظر خودتون و نتیجه استفاده از این نوشته رو از طریق ای‌میل (مسلما با استفاده از Mutt) و یا کامنت به من بگید. همین‌طور اگر در این نوشته به ایرادی برخوردید، حتما من رو مطلع کنید.

