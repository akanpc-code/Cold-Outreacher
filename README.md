# Cold Outreacher

**Send personalized Gmail outreach from a spreadsheet. No backend. No mail server. Just Gmail + Tampermonkey.**

Cold Outreacher is a Tampermonkey userscript that turns Gmail into a lightweight spreadsheet-powered outreach tool.

Load an Excel or CSV file, set your delay, and let Cold Outreacher handle the repetitive parts of composing and sending your emails.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Open `cold-outreacher.user.js`.
3. Copy the entire script into a new Tampermonkey userscript.
4. Save it.
5. Open [Gmail](https://mail.google.com/).
6. Look for the **Cold Outreacher** panel in the bottom-right corner.

That's it.

## What it does

Give it a spreadsheet like this:

| Email ID                                    | Subject            | Body                                 |
| ------------------------------------------- | ------------------ | ------------------------------------ |
| [john@example.com](mailto:john@example.com) | Quick introduction | Hey John, I wanted to reach out...   |
| [jane@example.com](mailto:jane@example.com) | Collaboration      | Hey Jane, I came across your work... |

Cold Outreacher takes care of the rest:

1. Opens Gmail Compose
2. Enters the recipient
3. Enters the subject
4. Inserts the message
5. Preserves your Gmail signature
6. Sends the email
7. Waits for your configured delay
8. Moves to the next row

## The idea

### Before

> Open Gmail
> Click Compose
> Copy email address
> Paste email address
> Enter subject
> Copy message
> Paste message
> Click Send
> Wait
> Repeat 100 times

### After

> Upload your spreadsheet.
>
> Set the delay.
>
> Click **START**.
>
> Cold Outreacher handles the repetitive work.

## Spreadsheet format

Your spreadsheet needs three basic columns:

```text
Email ID | Subject | Body
```

For example:

```text
john@example.com | Partnership Opportunity | Hi John,

I wanted to reach out regarding a potential collaboration.

Best,
Your Name
```

### Supported column names

**Email**

* `Email ID`
* `Email`
* `EmailID`
* `E-mail`
* `E-mail ID`

**Message**

* `Body`
* `Message`
* `Email Body`

Rows without an email address are automatically skipped.

## Features

* Excel `.xlsx` support
* Excel `.xls` support
* CSV support
* Personalized subject and body for every recipient
* Automatic Gmail Compose detection
* Automatic recipient entry
* Automatic sending
* Configurable delay between emails
* Start / Stop / Reset controls
* Live progress tracking
* Gmail signature preservation
* Error detection
* Gmail SPA protection
* No external backend

## The panel

Cold Outreacher keeps things simple:

```text
┌──────────────────────────────┐
│ Cold Outreacher           −  │
├──────────────────────────────┤
│                              │
│ Select Excel / CSV            │
│                              │
│ 25 emails loaded.             │
│                              │
│ Delay between emails: 5 sec  │
│                              │
│ [ START ] [ STOP ] [ RESET ] │
│                              │
│ Excel columns:               │
│ Email ID | Subject | Body    │
└──────────────────────────────┘
```

The panel starts minimized so it stays out of the way while you're using Gmail.

## Why Tampermonkey?

Cold Outreacher runs directly inside Gmail.

There is:

* No server to deploy
* No database
* No API key
* No SMTP configuration
* No separate desktop application
* No backend to keep running

Your browser does the work.

## How it works

```text
             Excel / CSV
                  │
                  ▼
             SheetJS
                  │
                  ▼
          Cold Outreacher
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
    Recipient   Subject    Body
        │         │         │
        └─────────┼─────────┘
                  ▼
            Gmail Compose
                  │
                  ▼
                Send
                  │
                  ▼
             Next Email
```

The spreadsheet is read locally in your browser using [SheetJS](https://sheetjs.com/).

## Delay

You can configure the delay between emails from the Cold Outreacher panel.

Default:

```text
5 seconds
```

Minimum:

```text
2 seconds
```

The delay exists so the automation doesn't immediately hammer Gmail with consecutive UI actions.

**Important:** The delay does not bypass Gmail's sending limits or anti-spam systems.

## Stop and resume

Click **STOP** at any point to stop the sending loop.

Your current position is retained.

Click **START** again to continue from where it stopped.

Click **RESET** if you want to start the spreadsheet from the beginning.

## Gmail signature

Already have a Gmail signature configured?

Cold Outreacher preserves it.

Your spreadsheet controls the message content, while the existing Gmail signature remains at the bottom of the email.

For example:

```text
Hi John,

I wanted to reach out regarding a potential collaboration.

Best,
Your Name
```

The existing Gmail signature is retained automatically.

## Error handling

Cold Outreacher stops if Gmail doesn't behave as expected.

For example:

```text
Recipient field not found.
Subject field not found.
Email body field not found.
Gmail Compose button not found.
Gmail Send button not found.
```

Instead of silently continuing and potentially sending incorrect emails, the script stops and reports the problem.

## Gmail SPA protection

Gmail is a single-page application.

That means navigating around Gmail doesn't necessarily reload the page.

Cold Outreacher periodically checks whether its interface still exists and recreates it if Gmail removes it.

So you don't have to keep reopening the userscript panel while navigating Gmail.

## Privacy

Cold Outreacher does not require a Cold Outreacher server.

The spreadsheet is processed inside your browser.

There is no Cold Outreacher database collecting:

* Email addresses
* Subjects
* Message contents
* Spreadsheet files

The only external library loaded by the script is SheetJS for reading spreadsheet files.

## Important

Cold Outreacher automates the Gmail interface.

It **does not**:

* Increase Gmail's sending limits
* Bypass Gmail restrictions
* Bypass spam detection
* Provide an official Gmail API
* Guarantee inbox placement
* Guarantee that every email will be delivered

Gmail's own limits and policies still apply.

Use it responsibly and only contact people where you have an appropriate reason and permission to do so.

## Limitations

Because Cold Outreacher interacts with Gmail's web interface, changes to Gmail can break parts of the automation.

For example, Google may change:

* Compose selectors
* Recipient fields
* Send buttons
* Gmail's DOM structure
* Editor behavior

If Gmail changes its interface, the userscript may need to be updated.

## Project structure

```text
cold-outreacher/
│
├── cold-outreacher.user.js
├── README.md
└── LICENSE
```

## Dependencies

* [Tampermonkey](https://www.tampermonkey.net/)
* [SheetJS](https://sheetjs.com/)

SheetJS is loaded through its CDN:

```text
https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
```

## Contributing

Found a bug?

Have an improvement?

Open an issue or submit a pull request.

When reporting a Gmail compatibility issue, include:

1. Browser
2. Gmail behavior that failed
3. Console error, if available
4. Steps to reproduce

Please don't include private email addresses or message contents in issues.

## License

MIT License.

See [`LICENSE`](LICENSE) for the full license text.

## Disclaimer

Cold Outreacher is an independent open-source project.

It is **not affiliated with, endorsed by, or sponsored by Google or Gmail**.

Gmail and Google are trademarks of Google LLC.

---

**Cold Outreacher — Gmail outreach, without the repetitive clicking.**
