// ==UserScript==
// @name         Cold Outreacher
// @namespace    https://github.com/akanpc-code/Cold-Outreacher
// @version      18.0
// @description  Gmail bulk outreach tool using Excel or CSV data
// @match        https://mail.google.com/*
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {

    'use strict';

    let rows = [];
    let current = 0;
    let running = false;

    // START MINIMIZED
    let minimized = true;


    /* =========================================================
       HELPERS
    ========================================================= */

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function status(text) {

        const el = document.getElementById('co-status');

        if (el) {
            el.textContent = text;
        }
    }


    /* =========================================================
       MINIMIZE / MAXIMIZE
    ========================================================= */

    function toggleMinimize() {

        const box =
            document.getElementById('cold-outreacher');

        const content =
            document.getElementById('co-panel-content');

        const button =
            document.getElementById('co-minimize');


        if (!box || !content || !button) {
            return;
        }


        minimized = !minimized;


        if (minimized) {

            /* ================================================
               MINIMIZED
            ================================================= */

            box.style.width = '250px';
            box.style.padding = '10px 12px';

            content.style.display = 'none';

            button.textContent = '-';

            button.title = 'Expand';


        } else {

            /* ================================================
               MAXIMIZED
            ================================================= */

            box.style.width = '370px';
            box.style.padding = '18px';

            content.style.display = 'block';

            button.textContent = '-';

            button.title = 'Minimize';
        }
    }


    /* =========================================================
       PANEL
    ========================================================= */

    function createPanel() {

        if (
            document.getElementById('cold-outreacher')
        ) {
            return;
        }


        const box =
            document.createElement('div');


        box.id =
            'cold-outreacher';


        box.style.cssText = `
            position:fixed;
            right:20px;
            bottom:20px;
            width:250px;
            padding:10px 12px;
            background:#202124;
            color:#fff;
            border:2px solid #34a853;
            border-radius:10px;
            z-index:2147483647;
            font-family:Arial,sans-serif;
            font-size:14px;
            box-shadow:0 8px 30px rgba(0,0,0,.55);
            box-sizing:border-box;
        `;


        /* =====================================================
           HEADER
        ===================================================== */

        const header =
            document.createElement('div');


        header.style.cssText = `
            width:100%;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            box-sizing:border-box;
            margin:0;
        `;


        const title =
            document.createElement('div');


        title.textContent =
            'Cold Outreacher';


        title.style.cssText = `
            font-size:20px;
            font-weight:bold;
            line-height:24px;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            flex:1;
            min-width:0;
        `;


        header.appendChild(title);


        /* =====================================================
           MINUS BUTTON
        ===================================================== */

        const minimize =
            document.createElement('button');


        minimize.id =
            'co-minimize';


        minimize.textContent =
            '-';


        minimize.title =
            'Expand';


        minimize.style.cssText = `
            width:28px;
            height:28px;
            min-width:28px;
            max-width:28px;
            padding:0;
            margin:0;
            cursor:pointer;
            font-size:20px;
            line-height:24px;
            font-weight:bold;
            text-align:center;
            display:flex;
            align-items:center;
            justify-content:center;
            border-radius:5px;
            border:1px solid #aaa;
            background:#f1f3f4;
            color:#202124;
            box-sizing:border-box;
        `;


        minimize.addEventListener(
            'click',
            toggleMinimize
        );


        header.appendChild(
            minimize
        );


        box.appendChild(
            header
        );


        /* =====================================================
           PANEL CONTENT
        ===================================================== */

        const content =
            document.createElement('div');


        content.id =
            'co-panel-content';


        /*
         * Since the panel starts minimized,
         * hide content immediately.
         */

        content.style.display =
            'none';


        /* =====================================================
           FILE
        ===================================================== */

        const file =
            document.createElement('input');


        file.id =
            'co-file';


        file.type =
            'file';


        file.accept =
            '.xlsx,.xls,.csv';


        file.style.width =
            '100%';


        content.appendChild(
            file
        );


        /* =====================================================
           STATUS
        ===================================================== */

        const stat =
            document.createElement('div');


        stat.id =
            'co-status';


        stat.textContent =
            'Ready. Select your Excel file.';


        stat.style.cssText = `
            margin-top:12px;
            padding:10px;
            background:#303134;
            border-radius:6px;
            white-space:pre-line;
            line-height:1.5;
        `;


        content.appendChild(
            stat
        );


        /* =====================================================
           DELAY
        ===================================================== */

        const delayRow =
            document.createElement('div');


        delayRow.style.marginTop =
            '12px';


        const delayLabel =
            document.createElement('span');


        delayLabel.textContent =
            'Delay between emails: ';


        delayRow.appendChild(
            delayLabel
        );


        const delay =
            document.createElement('input');


        delay.id =
            'co-delay';


        delay.type =
            'number';


        delay.value =
            '5';


        delay.min =
            '2';


        delay.style.cssText = `
            width:55px;
            padding:5px;
            box-sizing:border-box;
        `;


        delayRow.appendChild(
            delay
        );


        const seconds =
            document.createElement('span');


        seconds.textContent =
            ' seconds';


        delayRow.appendChild(
            seconds
        );


        content.appendChild(
            delayRow
        );


        /* =====================================================
           BUTTONS
        ===================================================== */

        const buttons =
            document.createElement('div');


        buttons.style.cssText = `
            margin-top:15px;
            display:flex;
            gap:7px;
        `;


        const start =
            document.createElement('button');


        start.id =
            'co-start';


        start.textContent =
            'START';


        start.style.cssText = `
            padding:9px 18px;
            cursor:pointer;
            font-weight:bold;
        `;


        const stop =
            document.createElement('button');


        stop.id =
            'co-stop';


        stop.textContent =
            'STOP';


        stop.style.cssText = `
            padding:9px 18px;
            cursor:pointer;
            font-weight:bold;
        `;


        const reset =
            document.createElement('button');


        reset.id =
            'co-reset';


        reset.textContent =
            'RESET';


        reset.style.cssText = `
            padding:9px 18px;
            cursor:pointer;
        `;


        buttons.appendChild(
            start
        );


        buttons.appendChild(
            stop
        );


        buttons.appendChild(
            reset
        );


        content.appendChild(
            buttons
        );


        /* =====================================================
           INFO
        ===================================================== */

        const info =
            document.createElement('div');


        info.textContent =
            'Excel columns: Email ID | Subject | Body';


        info.style.cssText = `
            margin-top:12px;
            color:#aaa;
            font-size:11px;
        `;


        content.appendChild(
            info
        );


        box.appendChild(
            content
        );


        document.body.appendChild(
            box
        );


        /* =====================================================
           EVENTS
        ===================================================== */

        file.addEventListener(
            'change',
            readExcel
        );


        start.addEventListener(
            'click',
            startMailer
        );


        stop.addEventListener(
            'click',
            stopMailer
        );


        reset.addEventListener(
            'click',
            resetMailer
        );
    }


    /* =========================================================
       READ EXCEL
    ========================================================= */

    async function readExcel(event) {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        try {

            status(
                'Reading Excel...'
            );


            const buffer =
                await file.arrayBuffer();


            const workbook =
                XLSX.read(
                    buffer,
                    {
                        type: 'array'
                    }
                );


            const sheet =
                workbook.Sheets[
                    workbook.SheetNames[0]
                ];


            const data =
                XLSX.utils.sheet_to_json(
                    sheet,
                    {
                        defval: '',
                        raw: false
                    }
                );


            rows = [];


            for (const row of data) {

                const keys =
                    Object.keys(row);


                function getValue(names) {

                    const key =
                        keys.find(k =>
                            names.includes(
                                String(k)
                                    .trim()
                                    .toLowerCase()
                            )
                        );


                    if (!key) {
                        return '';
                    }


                    return String(
                        row[key]
                    );
                }


                const email =
                    getValue([
                        'email id',
                        'email',
                        'emailid',
                        'e-mail',
                        'e-mail id'
                    ]).trim();


                const subject =
                    getValue([
                        'subject'
                    ]);


                const body =
                    getValue([
                        'body',
                        'message',
                        'email body'
                    ]);


                if (email) {

                    rows.push({
                        email: email,
                        subject: subject,
                        body: body
                    });
                }
            }


            current = 0;


            status(
                rows.length +
                ' emails loaded.\n\n' +
                'Ready to start.'
            );


            console.log(
                'COLD OUTREACHER EXCEL:',
                rows
            );


        } catch (error) {

            console.error(error);


            status(
                'ERROR READING EXCEL:\n' +
                error.message
            );
        }
    }


    /* =========================================================
       FIND COMPOSE WINDOW
    ========================================================= */

    function findComposeWindow() {

        const subjects =
            document.querySelectorAll(
                'input[name="subjectbox"]'
            );


        for (const subject of subjects) {

            let parent =
                subject.parentElement;


            for (
                let i = 0;
                i < 15 && parent;
                i++
            ) {

                const body =
                    parent.querySelector(
                        'div[contenteditable="true"]'
                    );


                if (body) {
                    return parent;
                }


                parent =
                    parent.parentElement;
            }
        }


        return null;
    }


    /* =========================================================
       FIND COMPOSE BUTTON
    ========================================================= */

    function findComposeButton() {

        let button =
            document.querySelector(
                'div[gh="cm"]'
            );


        if (
            button &&
            button.offsetParent !== null
        ) {
            return button;
        }


        const selectors = [
            '[aria-label="Compose"]',
            '[aria-label*="Compose" i]',
            '[data-tooltip="Compose"]',
            '[data-tooltip*="Compose" i]',
            '[title="Compose"]',
            '[title*="Compose" i]'
        ];


        for (
            const selector of selectors
        ) {

            const elements =
                document.querySelectorAll(
                    selector
                );


            for (
                const element of elements
            ) {

                if (
                    element.offsetParent !== null
                ) {

                    return element;
                }
            }
        }


        const elements =
            document.querySelectorAll(
                'button,[role="button"],div[tabindex],span'
            );


        for (
            const element of elements
        ) {

            if (
                element.offsetParent === null
            ) {
                continue;
            }


            const values = [
                element.getAttribute(
                    'aria-label'
                ) || '',

                element.getAttribute(
                    'data-tooltip'
                ) || '',

                element.getAttribute(
                    'title'
                ) || '',

                element.innerText || ''
            ];


            if (
                values.some(v =>
                    /^compose$/i.test(
                        v.trim()
                    )
                )
            ) {

                const parent =
                    element.closest(
                        '[role="button"],button,[gh="cm"],[tabindex]'
                    );


                return parent || element;
            }
        }


        return null;
    }


    /* =========================================================
       OPEN COMPOSE
    ========================================================= */

    async function openCompose() {

        let compose =
            findComposeWindow();


        if (compose) {
            return compose;
        }


        for (
            let attempt = 1;
            attempt <= 10;
            attempt++
        ) {

            status(
                'Opening Gmail Compose...\n\n' +
                'Attempt ' +
                attempt +
                ' / 10'
            );


            const button =
                findComposeButton();


            if (button) {

                button.click();


                for (
                    let i = 0;
                    i < 30;
                    i++
                ) {

                    compose =
                        findComposeWindow();


                    if (compose) {
                        return compose;
                    }


                    await sleep(250);
                }
            }


            await sleep(500);
        }


        throw new Error(
            'Gmail Compose button not found.'
        );
    }


    /* =========================================================
       SET INPUT
    ========================================================= */

    function setInput(
        element,
        value
    ) {

        element.focus();


        const setter =
            Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                'value'
            ).set;


        setter.call(
            element,
            value
        );


        element.dispatchEvent(
            new Event(
                'input',
                {
                    bubbles: true
                }
            )
        );


        element.dispatchEvent(
            new Event(
                'change',
                {
                    bubbles: true
                }
            )
        );
    }


    /* =========================================================
       PRESS ENTER
    ========================================================= */

    function pressEnter(element) {

        element.focus();


        element.dispatchEvent(
            new KeyboardEvent(
                'keydown',
                {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                }
            )
        );


        element.dispatchEvent(
            new KeyboardEvent(
                'keypress',
                {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                }
            )
        );


        element.dispatchEvent(
            new KeyboardEvent(
                'keyup',
                {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                }
            )
        );
    }


    /* =========================================================
       INSERT MESSAGE

       NO innerHTML
       NO execCommand
       EXISTING GMAIL SIGNATURE PRESERVED
    ========================================================= */

    function insertMessage(
        editor,
        bodyText
    ) {

        const signature =
            editor.querySelector(
                '.gmail_signature'
            );


        let text =
            String(bodyText)
                .replace(/\r\n/g, '\n')
                .replace(/\r/g, '\n');


        /*
         * Remove trailing Excel line breaks.
         */

        text =
            text.replace(
                /\n+$/,
                ''
            );


        /*
         * Remove editor contents
         * WITHOUT using innerHTML.
         */

        while (
            editor.firstChild
        ) {

            editor.removeChild(
                editor.firstChild
            );
        }


        /*
         * Insert body.
         */

        const lines =
            text.split('\n');


        lines.forEach(
            function (line, index) {

                if (line.length > 0) {

                    editor.appendChild(
                        document.createTextNode(
                            line
                        )
                    );
                }


                if (
                    index <
                    lines.length - 1
                ) {

                    editor.appendChild(
                        document.createElement(
                            'br'
                        )
                    );
                }
            }
        );


        /*
         * EXACTLY ONE BR BEFORE
         * EXISTING GMAIL SIGNATURE.
         */

        if (signature) {

            editor.appendChild(
                document.createElement(
                    'br'
                )
            );


            editor.appendChild(
                signature
            );
        }


        /*
         * Notify Gmail.
         */

        editor.dispatchEvent(
            new InputEvent(
                'input',
                {
                    bubbles: true,
                    inputType: 'insertText',
                    data: text
                }
            )
        );


        editor.dispatchEvent(
            new Event(
                'change',
                {
                    bubbles: true
                }
            )
        );


        editor.focus();
    }


    /* =========================================================
       FIND SEND BUTTON
    ========================================================= */

    function findSendButton(compose) {

        const selectors = [
            '[role="button"][aria-label="Send"]',
            '[aria-label="Send"]',
            '[data-tooltip="Send"]',
            '[aria-label*="Send" i]'
        ];


        for (
            const selector of selectors
        ) {

            const button =
                compose.querySelector(
                    selector
                );


            if (button) {

                return button;
            }
        }


        return null;
    }


    /* =========================================================
       SEND ONE
    ========================================================= */

    async function sendOne(row) {

        status(
            'Opening Compose...\n\n' +
            row.email
        );


        const compose =
            await openCompose();


        await sleep(500);


        /*
         * RECIPIENT
         */

        const to =
            compose.querySelector(
                'input[aria-label*="Recipients" i]'
            ) ||

            compose.querySelector(
                'input[placeholder*="Recipients" i]'
            ) ||

            compose.querySelector(
                'input[peoplekit-id]'
            ) ||

            compose.querySelector(
                'input[type="text"]'
            );


        /*
         * SUBJECT
         */

        const subject =
            compose.querySelector(
                'input[name="subjectbox"]'
            );


        /*
         * BODY
         */

        const body =
            compose.querySelector(
                'div[contenteditable="true"]'
            );


        if (!to) {

            throw new Error(
                'Recipient field not found.'
            );
        }


        if (!subject) {

            throw new Error(
                'Subject field not found.'
            );
        }


        if (!body) {

            throw new Error(
                'Email body field not found.'
            );
        }


        /* =====================================================
           RECIPIENT
        ===================================================== */

        status(
            'Entering recipient...\n\n' +
            row.email
        );


        setInput(
            to,
            row.email
        );


        await sleep(700);


        pressEnter(to);


        await sleep(700);


        /* =====================================================
           SUBJECT
        ===================================================== */

        status(
            'Entering subject...\n\n' +
            row.subject
        );


        setInput(
            subject,
            row.subject
        );


        await sleep(500);


        /* =====================================================
           BODY
        ===================================================== */

        status(
            'Entering body...\n\n' +
            row.email
        );


        insertMessage(
            body,
            row.body
        );


        await sleep(1000);


        if (!running) {
            return;
        }


        /* =====================================================
           SEND
        ===================================================== */

        status(
            'Sending...\n\n' +
            row.email
        );


        const send =
            findSendButton(
                compose
            );


        if (!send) {

            throw new Error(
                'Gmail Send button not found.'
            );
        }


        send.click();


        await sleep(1800);
    }


    /* =========================================================
       START
    ========================================================= */

    async function startMailer() {

        if (running) {
            return;
        }


        if (!rows.length) {

            alert(
                'Load your Excel file first.'
            );

            return;
        }


        if (
            current >= rows.length
        ) {

            alert(
                'All emails are finished.\n\n' +
                'Click RESET to start again.'
            );

            return;
        }


        running = true;


        while (
            running &&
            current < rows.length
        ) {

            const row =
                rows[current];


            try {

                await sendOne(row);


                if (!running) {
                    break;
                }


                current++;


                status(
                    'SENT: ' +
                    current +
                    ' / ' +
                    rows.length +
                    '\n\n' +
                    row.email
                );


            } catch (error) {

                console.error(
                    'COLD OUTREACHER ERROR:',
                    error
                );


                running = false;


                alert(
                    'MAILER STOPPED\n\n' +

                    'Row: ' +
                    (current + 1) +

                    '\nEmail: ' +
                    row.email +

                    '\n\n' +

                    error.message
                );


                return;
            }


            if (!running) {
                break;
            }


            if (
                current >= rows.length
            ) {
                break;
            }


            const delay =
                Math.max(
                    2000,
                    Number(
                        document.getElementById(
                            'co-delay'
                        ).value
                    ) * 1000
                );


            status(
                'SENT: ' +
                current +
                ' / ' +
                rows.length +

                '\n\nWaiting ' +
                (delay / 1000) +
                ' seconds...'
            );


            await sleep(delay);
        }


        running = false;


        if (
            current >= rows.length
        ) {

            status(
                'FINISHED\n\n' +
                rows.length +
                ' emails processed.'
            );
        }
    }


    /* =========================================================
       STOP
    ========================================================= */

    function stopMailer() {

        running = false;


        status(
            'STOPPED\n\n' +
            'Progress: ' +
            current +
            ' / ' +
            rows.length
        );
    }


    /* =========================================================
       RESET
    ========================================================= */

    function resetMailer() {

        running = false;

        current = 0;


        if (rows.length) {

            status(
                rows.length +
                ' emails loaded.\n\n' +
                'Ready to start.'
            );

        } else {

            status(
                'No Excel loaded.'
            );
        }
    }


    /* =========================================================
       INIT
    ========================================================= */

    function init() {

        createPanel();


        console.log(
            'COLD OUTREACHER v18 LOADED'
        );
    }


    init();


    /* =========================================================
       GMAIL SPA PROTECTION
    ========================================================= */

    setInterval(
        function () {

            if (
                !document.getElementById(
                    'cold-outreacher'
                )
            ) {

                createPanel();
            }

        },
        1000
    );

})();
