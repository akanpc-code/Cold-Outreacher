Cold Outreacher

A lightweight Tampermonkey userscript for automating personalized bulk email outreach directly through Gmail using Excel or CSV data.

Cold Outreacher reads recipient information from a spreadsheet and automatically handles Gmail Compose, recipient entry, subject, message insertion, and sending — without requiring a separate email server or desktop application.

Features
Send personalized emails directly through Gmail
Import recipients from Excel (.xlsx, .xls) or CSV (.csv)
Automatically detect Gmail's Compose window
Automatically enter:
Recipient email
Subject
Email body
Preserve your existing Gmail signature
Configurable delay between emails
Start / Stop / Reset controls
Real-time sending progress
Automatic error detection
Automatically recreates the interface if Gmail's SPA navigation removes it
Runs entirely inside the browser
No external backend required
Spreadsheet Format

Your spreadsheet should contain the following columns:

Column	Required	Description
Email ID	Yes	Recipient's email address
Subject	Yes	Email subject
Body	Yes	Email message

Example:

Email ID	Subject	Body
john@example.com	Partnership Opportunity	Hello John, I wanted to reach out regarding...
jane@example.com	Collaboration Proposal	Hello Jane, I came across your work and...

The script also recognizes these email column names:

Email ID
Email
EmailID
E-mail
E-mail ID

And these body column names:

Body
Message
Email Body

Rows without an email address are ignored.

Installation
1. Install Tampermonkey

Install the Tampermonkey browser extension for your browser.

2. Create the userscript

Open the Tampermonkey dashboard and create a new script.

Delete the default code and paste the contents of:

cold-outreacher.user.js

Save the script.

3. Open Gmail

Open:

https://mail.google.com/

After the userscript loads, the Cold Outreacher panel will appear in the bottom-right corner.

Usage
Step 1 — Prepare your spreadsheet

Create an Excel or CSV file containing:

Email ID | Subject | Body

For example:

john@example.com | Introduction | Hello John,

I wanted to get in touch regarding a potential collaboration.

Best,
Your Name
Step 2 — Load the spreadsheet

Open Gmail and click the Cold Outreacher panel.

Select your .xlsx, .xls, or .csv file.

The script will display the number of emails loaded.

Step 3 — Configure the delay

Set the delay between emails.

The default delay is:

5 seconds

The minimum delay enforced by the script is:

2 seconds
Step 4 — Start

Click:

START

Cold Outreacher will process the spreadsheet sequentially.

For each row it will:

Open Gmail Compose
Enter the recipient
Confirm the recipient
Enter the subject
Insert the email body
Preserve the existing Gmail signature
Click Send
Wait for the configured delay
Continue to the next recipient
Controls
START

Begins sending from the current position.

STOP

Immediately stops the sending loop.

Your current progress is retained, allowing you to continue later.

RESET

Resets the current position to the beginning of the loaded spreadsheet.

Email Signature

Cold Outreacher is designed to preserve an existing Gmail signature.

When inserting the message, the script:

Removes the previous compose body
Inserts the spreadsheet message
Keeps the existing Gmail signature
Places a single line break between the message and signature

It does not use innerHTML or document.execCommand() for message insertion.

How It Works

Cold Outreacher operates as a browser userscript on the Gmail page.

Excel / CSV
     │
     ▼
SheetJS
     │
     ▼
Cold Outreacher
     │
     ├── Recipient
     ├── Subject
     └── Body
     │
     ▼
Gmail Compose
     │
     ▼
Send
     │
     ▼
Next Recipient

The spreadsheet is processed locally in the browser using the SheetJS library.

No spreadsheet data is uploaded to a Cold Outreacher server.

Dependencies

Cold Outreacher uses:

Tampermonkey
SheetJS

SheetJS is loaded through its CDN:

https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
Browser Compatibility

Cold Outreacher is intended for Chromium-based browsers and Gmail's web interface.

Recommended:

Google Chrome
Microsoft Edge
Brave
Other Chromium-based browsers supporting Tampermonkey

Gmail's interface can change over time. Because the script interacts with Gmail's web UI, future Gmail updates may require selector or automation changes.

Limitations

Cold Outreacher relies on Gmail's current web interface.

Potential issues can occur if:

Gmail changes its Compose interface
Gmail changes recipient or Send button selectors
Gmail introduces additional anti-automation behavior
The account reaches Gmail sending limits
Gmail temporarily restricts sending activity
The browser extension is disabled
The Gmail tab is closed or suspended

The script stops when it encounters an error rather than blindly continuing.

Sending Limits

Cold Outreacher does not increase or bypass Gmail's sending limits.

Your Gmail account's existing sending limits, restrictions, spam policies, and account protections still apply.

Use the tool responsibly and only send messages to recipients where you have an appropriate basis for contacting them.

Privacy

Cold Outreacher is a client-side userscript.

The spreadsheet is processed directly in your browser. The project itself does not provide a backend server for collecting recipient data or email content.

However, Gmail and the browser environment remain subject to their own privacy policies and security mechanisms.

Project Structure

The primary project file is:

cold-outreacher/
│
├── cold-outreacher.user.js
└── README.md
Configuration

The default delay is configured in the script:

delay.value = '5';

The minimum delay is:

delay.min = '2';

The script also enforces the minimum delay programmatically:

Math.max(
    2000,
    Number(
        document.getElementById('co-delay').value
    ) * 1000
)
Error Handling

If an operation fails, Cold Outreacher stops the sending process and reports:

The row being processed
The email address
The error encountered

Examples of detected errors include:

Recipient field not found.
Subject field not found.
Email body field not found.
Gmail Compose button not found.
Gmail Send button not found.

This prevents the script from continuing through the spreadsheet when Gmail is no longer behaving as expected.

Gmail SPA Protection

Gmail is a single-page application, meaning navigation within Gmail does not necessarily reload the page.

Cold Outreacher periodically checks whether its interface still exists:

setInterval(function () {
    if (!document.getElementById('cold-outreacher')) {
        createPanel();
    }
}, 1000);

If Gmail removes the panel during navigation, it is automatically recreated.

Responsible Use

This project is intended for legitimate email outreach and workflow automation.

Do not use it for:

Spam
Unsolicited mass messaging
Harassment
Deceptive communications
Circumventing Gmail restrictions
Sending content that violates applicable laws or platform policies

You are responsible for the emails sent through your Gmail account.

Contributing

Pull requests and improvements are welcome.

If you find that Gmail has changed its interface and the script no longer works:

Open an issue
Describe what stopped working
Include relevant browser/Gmail information
Include console errors where possible
Avoid posting private recipient information

Disclaimer

Cold Outreacher is an independent browser automation project.

It is not affiliated with, endorsed by, or sponsored by Google or Gmail.

Gmail and Google are trademarks of Google LLC.
