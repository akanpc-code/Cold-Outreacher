// ==UserScript==
// @name         Cold Outreacher
// @namespace    https://github.com/akanpc-code/Cold-Outreacher
// @version      20.0
// @description  Gmail bulk outreach tool using CSV data
// @match        https://mail.google.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {

    'use strict';


    /* =========================================================
       STATE
    ========================================================= */

    let rows = [];
    let current = 0;
    let running = false;
    let minimized = true;


    /* =========================================================
       HELPERS
    ========================================================= */

    function sleep(ms) {

        return new Promise(function (resolve) {

            setTimeout(resolve, ms);

        });

    }


    function status(text) {

        const element =
            document.getElementById('co-status');

        if (element) {

            element.textContent = text;

        }

    }


    /* =========================================================
       REMOVE OLD UI
    ========================================================= */

    function removeOldUI() {

        const ids = [

            'cold-outreacher',
            'co-toggle',
            'co-styles',

            // Older versions
            'sugoi-mailer',
            'sd-toggle',
            'sd-mailer-wrapper',
            'sd-mailer-styles'

        ];


        ids.forEach(function (id) {

            const element =
                document.getElementById(id);

            if (element) {

                element.remove();

            }

        });

    }


    /* =========================================================
       STYLES
    ========================================================= */

    function addStyles() {

        if (
            document.getElementById('co-styles')
        ) {

            return;

        }


        const style =
            document.createElement('style');


        style.id =
            'co-styles';


        style.textContent = `

            /* =================================================
               MAIN PANEL
            ================================================= */

            #cold-outreacher {

                position: fixed;

                right: 20px;

                bottom: 60px;

                width: 370px;

                box-sizing: border-box;

                z-index: 2147483647;

                padding: 18px;

                background: #ffffff;

                color: #25202f;

                border: 1px solid #e5dff0;

                border-radius: 12px;

                box-shadow:
                    0 8px 30px
                    rgba(72,45,105,.12);

                font-family:
                    Arial,
                    sans-serif;

                font-size: 14px;

                transform:
                    translateX(0);

                transition:
                    transform
                    .38s
                    cubic-bezier(.4,0,.2,1);

            }


            /* =================================================
               MINIMIZED PANEL
            ================================================= */

            #cold-outreacher.co-minimized {

                transform:
                    translateX(390px);

            }


            /* =================================================
               TOGGLE
            ================================================= */

            #co-toggle {

                position: fixed;

                right: -1px;

                bottom: 60px;

                width: 42px;

                height: 42px;

                padding: 0;

                margin: 0;

                border:
                    1px solid #e5dff0;

                border-radius: 50%;

                background: #ffffff;

                color: #7652a8;

                box-shadow:
                    0 3px 12px
                    rgba(72,45,105,.12);

                cursor: pointer;

                z-index: 2147483648;

                display: flex;

                align-items: center;

                justify-content: center;

                font-family:
                    Arial,
                    sans-serif;

                font-size: 28px;

                font-weight: 300;

                line-height: 42px;

                box-sizing: border-box;

                transition:

                    right
                    .38s
                    cubic-bezier(.4,0,.2,1),

                    transform
                    .18s
                    ease,

                    box-shadow
                    .18s
                    ease,

                    color
                    .18s
                    ease;

            }


            /* =================================================
               TOGGLE WHEN MINIMIZED
            ================================================= */

            #co-toggle.co-minimized {

                right: 10px;

            }


            /* =================================================
               TOGGLE HOVER
            ================================================= */

            #co-toggle:hover {

                color: #654394;

                transform:
                    scale(1.05);

                box-shadow:
                    0 5px 16px
                    rgba(72,45,105,.18);

            }


            /* =================================================
               TITLE
            ================================================= */

            #co-title {

                font-size: 20px;

                font-weight: 600;

                line-height: 24px;

                margin-bottom: 15px;

                color: #33263f;

                letter-spacing: -.2px;

            }


            /* =================================================
               FILE INPUT
            ================================================= */

            #co-file {

                width: 100%;

                box-sizing: border-box;

                color: #40364b;

                font-family:
                    Arial,
                    sans-serif;

                font-size: 13px;

            }


            /* =================================================
               STATUS
            ================================================= */

            #co-status {

                margin-top: 12px;

                padding: 10px;

                background: #f7f4fb;

                color: #5d5268;

                border:
                    1px solid #eee8f5;

                border-radius: 8px;

                white-space: pre-line;

                line-height: 1.5;

                box-sizing: border-box;

            }


            /* =================================================
               DELAY
            ================================================= */

            #co-delay-row {

                margin-top: 12px;

                display: flex;

                align-items: center;

                gap: 4px;

                color: #40364b;

            }


            #co-delay {

                width: 55px;

                padding: 5px;

                box-sizing: border-box;

                border:
                    1px solid #ddd3e8;

                border-radius: 6px;

                background: #ffffff;

                color: #33283d;

                outline: none;

            }


            #co-delay:focus {

                border-color: #9a7bc1;

                box-shadow:
                    0 0 0 2px
                    rgba(118,82,168,.10);

            }


            /* =================================================
               BUTTON CONTAINER
            ================================================= */

            #co-buttons {

                margin-top: 15px;

                display: flex;

                gap: 7px;

            }


            /* =================================================
               BUTTONS
            ================================================= */

            #co-buttons button {

                padding:
                    9px 18px;

                cursor: pointer;

                font-family:
                    Arial,
                    sans-serif;

                font-size: 13px;

                border-radius: 7px;

                outline: none;

                transition:

                    background
                    .15s
                    ease,

                    border-color
                    .15s
                    ease,

                    transform
                    .15s
                    ease;

            }


            /* START */

            #co-start {

                font-weight: 600;

                color: #ffffff;

                background: #7652a8;

                border:
                    1px solid #7652a8;

            }


            #co-start:hover {

                background: #68479a;

                transform:
                    translateY(-1px);

            }


            /* STOP */

            #co-stop {

                font-weight: 600;

                color: #5f4b72;

                background: #ffffff;

                border:
                    1px solid #ddd3e8;

            }


            #co-stop:hover {

                background: #f8f5fb;

                border-color: #cfc1df;

            }


            /* RESET */

            #co-reset {

                color: #5f4b72;

                background: #faf9fc;

                border:
                    1px solid #e5dff0;

            }


            #co-reset:hover {

                background: #f4eff9;

                border-color: #d8cde5;

            }


            /* =================================================
               INFO
            ================================================= */

            #co-info {

                margin-top: 12px;

                color: #8a7c96;

                font-size: 11px;

            }


            /* =================================================
               MOBILE
            ================================================= */

            @media (max-width: 600px) {

                #cold-outreacher {

                    width:
                        calc(100vw - 20px);

                    right: 10px;

                }


                #cold-outreacher.co-minimized {

                    transform:
                        translateX(100vw);

                }


                #co-toggle {

                    right: -1px;

                }


                #co-toggle.co-minimized {

                    right: 10px;

                }

            }

        `;


        document.head.appendChild(style);

    }


    /* =========================================================
       TOGGLE PANEL
    ========================================================= */

    function toggleMailer() {

        const panel =
            document.getElementById(
                'cold-outreacher'
            );


        const toggle =
            document.getElementById(
                'co-toggle'
            );


        if (!panel || !toggle) {

            return;

        }


        minimized =
            !minimized;


        if (minimized) {

            panel.classList.add(
                'co-minimized'
            );


            toggle.classList.add(
                'co-minimized'
            );


            toggle.textContent =
                '‹';


            toggle.title =
                'Open Cold Outreacher';


        } else {

            panel.classList.remove(
                'co-minimized'
            );


            toggle.classList.remove(
                'co-minimized'
            );


            toggle.textContent =
                '›';


            toggle.title =
                'Minimize Cold Outreacher';

        }

    }


    /* =========================================================
       CREATE TOGGLE
    ========================================================= */

    function createToggle() {

        if (
            document.getElementById(
                'co-toggle'
            )
        ) {

            return;

        }


        const toggle =
            document.createElement('button');


        toggle.id =
            'co-toggle';


        toggle.classList.add(
            'co-minimized'
        );


        toggle.textContent =
            '‹';


        toggle.title =
            'Open Cold Outreacher';


        toggle.type =
            'button';


        toggle.setAttribute(
            'aria-label',
            'Open Cold Outreacher'
        );


        toggle.addEventListener(
            'click',
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                toggleMailer();

            }
        );


        document.body.appendChild(
            toggle
        );

    }


    /* =========================================================
       CREATE PANEL
    ========================================================= */

    function createPanel() {

        if (
            document.getElementById(
                'cold-outreacher'
            )
        ) {

            return;

        }


        const panel =
            document.createElement('div');


        panel.id =
            'cold-outreacher';


        panel.classList.add(
            'co-minimized'
        );


        /* =====================================================
           TITLE
        ===================================================== */

        const title =
            document.createElement('div');


        title.id =
            'co-title';


        title.textContent =
            'Cold Outreacher';


        panel.appendChild(
            title
        );


        /* =====================================================
           FILE
        ===================================================== */

        const file =
            document.createElement('input');


        file.id =
            'co-file';


        file.type =
            'file';


        /*
         * CSV ONLY
         */

        file.accept =
            '.csv,text/csv';


        panel.appendChild(
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
            'Ready. Select your CSV file.';


        panel.appendChild(
            stat
        );


        /* =====================================================
           DELAY
        ===================================================== */

        const delayRow =
            document.createElement('div');


        delayRow.id =
            'co-delay-row';


        const delayLabel =
            document.createElement('span');


        delayLabel.textContent =
            'Delay between emails:';


        delayRow.appendChild(
            delayLabel
        );


        const delay =
            document.createElement('input');


        delay.id =
            'co-delay';


        delay.type =
            'number';


        /*
         * Default delay:
         * 15 seconds
         */

        delay.value =
            '15';


        delay.min =
            '2';


        delayRow.appendChild(
            delay
        );


        const seconds =
            document.createElement('span');


        seconds.textContent =
            'seconds';


        delayRow.appendChild(
            seconds
        );


        panel.appendChild(
            delayRow
        );


        /* =====================================================
           BUTTONS
        ===================================================== */

        const buttons =
            document.createElement('div');


        buttons.id =
            'co-buttons';


        const start =
            document.createElement('button');


        start.id =
            'co-start';


        start.type =
            'button';


        start.textContent =
            'START';


        const stop =
            document.createElement('button');


        stop.id =
            'co-stop';


        stop.type =
            'button';


        stop.textContent =
            'STOP';


        const reset =
            document.createElement('button');


        reset.id =
            'co-reset';


        reset.type =
            'button';


        reset.textContent =
            'RESET';


        buttons.appendChild(start);

        buttons.appendChild(stop);

        buttons.appendChild(reset);


        panel.appendChild(
            buttons
        );


        /* =====================================================
           INFO
        ===================================================== */

        const info =
            document.createElement('div');


        info.id =
            'co-info';


        info.textContent =
            'CSV columns: Email ID | Subject | Body';


        panel.appendChild(
            info
        );


        document.body.appendChild(
            panel
        );


        /* =====================================================
           EVENTS
        ===================================================== */

        file.addEventListener(
            'change',
            readCSV
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
       CSV PARSER
       ========================================================= */

    function parseCSV(text) {

        const result = [];

        let row = [];

        let field = '';

        let inQuotes = false;


        /*
         * Remove UTF-8 BOM if present.
         */

        text =
            String(text || '')
                .replace(/^\uFEFF/, '');


        for (
            let i = 0;
            i < text.length;
            i++
        ) {

            const char =
                text[i];


            const next =
                text[i + 1];


            /*
             * QUOTED FIELD
             */

            if (char === '"') {

                /*
                 * Escaped quote:
                 * ""
                 */

                if (
                    inQuotes &&
                    next === '"'
                ) {

                    field += '"';

                    i++;

                } else {

                    inQuotes =
                        !inQuotes;

                }

                continue;

            }


            /*
             * COMMA
             */

            if (
                char === ',' &&
                !inQuotes
            ) {

                row.push(field);

                field = '';

                continue;

            }


            /*
             * NEW LINE
             *
             * Newlines inside quoted fields are
             * preserved as part of the body.
             */

            if (
                (
                    char === '\n' ||
                    char === '\r'
                ) &&
                !inQuotes
            ) {

                /*
                 * Handle Windows CRLF.
                 */

                if (
                    char === '\r' &&
                    next === '\n'
                ) {

                    i++;

                }


                row.push(field);

                field = '';


                /*
                 * Ignore completely empty rows.
                 */

                if (
                    row.some(
                        function (value) {

                            return String(value)
                                .trim() !== '';

                        }
                    )
                ) {

                    result.push(row);

                }


                row = [];

                continue;

            }


            /*
             * NORMAL CHARACTER
             */

            field += char;

        }


        /*
         * Last field / row.
         */

        row.push(field);


        if (
            row.some(
                function (value) {

                    return String(value)
                        .trim() !== '';

                }
            )
        ) {

            result.push(row);

        }


        return result;

    }


    /* =========================================================
       NORMALIZE CSV HEADER
    ========================================================= */

    function normalizeHeader(value) {

        return String(value || '')
            .replace(/^\uFEFF/, '')
            .trim()
            .toLowerCase()
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ');

    }


    /* =========================================================
       FIND CSV COLUMN
    ========================================================= */

    function findColumn(
        headers,
        names
    ) {

        const normalizedHeaders =
            headers.map(
                normalizeHeader
            );


        for (
            const name of names
        ) {

            const wanted =
                normalizeHeader(name);


            const index =
                normalizedHeaders.indexOf(
                    wanted
                );


            if (index !== -1) {

                return index;

            }

        }


        return -1;

    }


    /* =========================================================
       READ CSV
    ========================================================= */

    async function readCSV(event) {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        try {

            status(
                'Reading CSV file...'
            );


            /*
             * Read as text.
             */

            const text =
                await file.text();


            /*
             * Parse CSV.
             */

            const data =
                parseCSV(text);


            if (!data.length) {

                throw new Error(
                    'CSV file is empty.'
                );

            }


            /*
             * First row = headers.
             */

            const headers =
                data[0];


            /*
             * Find columns.
             */

            const emailColumn =
                findColumn(
                    headers,
                    [
                        'email id',
                        'email',
                        'emailid',
                        'e-mail',
                        'e-mail id'
                    ]
                );


            const subjectColumn =
                findColumn(
                    headers,
                    [
                        'subject'
                    ]
                );


            const bodyColumn =
                findColumn(
                    headers,
                    [
                        'body',
                        'message',
                        'email body'
                    ]
                );


            if (
                emailColumn === -1
            ) {

                throw new Error(
                    'Email ID column not found.'
                );

            }


            if (
                subjectColumn === -1
            ) {

                throw new Error(
                    'Subject column not found.'
                );

            }


            if (
                bodyColumn === -1
            ) {

                throw new Error(
                    'Body column not found.'
                );

            }


            /*
             * Build rows.
             */

            rows = [];


            for (
                let i = 1;
                i < data.length;
                i++
            ) {

                const source =
                    data[i];


                const email =
                    String(
                        source[emailColumn] ||
                        ''
                    ).trim();


                if (!email) {

                    continue;

                }


                const subject =
                    String(
                        source[subjectColumn] ||
                        ''
                    );


                const body =
                    String(
                        source[bodyColumn] ||
                        ''
                    );


                rows.push({

                    email: email,

                    subject: subject,

                    body: body

                });

            }


            /*
             * Reset position.
             */

            current = 0;


            if (!rows.length) {

                throw new Error(
                    'No valid email rows found.'
                );

            }


            status(

                rows.length +
                ' emails loaded.\n\n' +
                'Ready to start.'

            );


            console.log(
                'COLD OUTREACHER:',
                rows
            );


        } catch (error) {

            console.error(
                'COLD OUTREACHER:',
                error
            );


            rows = [];

            current = 0;


            status(

                'ERROR READING FILE:\n' +
                error.message

            );

        }

    }


    /* =========================================================
       FIND GMAIL COMPOSE WINDOW
    ========================================================= */

    function findComposeWindow() {

        const subjects =
            document.querySelectorAll(
                'input[name="subjectbox"]'
            );


        for (
            const subject of subjects
        ) {

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
       FIND GMAIL COMPOSE BUTTON
    ========================================================= */

    function findComposeButton() {

        const direct =
            document.querySelector(
                'div[gh="cm"]'
            );


        if (
            direct &&
            direct.offsetParent !== null
        ) {

            return direct;

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
                values.some(
                    function (value) {

                        return /^compose$/i.test(
                            value.trim()
                        );

                    }
                )
            ) {

                return (
                    element.closest(
                        '[role="button"],button,[gh="cm"],[tabindex]'
                    ) ||
                    element
                );

            }

        }


        return null;

    }


    /* =========================================================
       OPEN GMAIL COMPOSE
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
       SET GMAIL INPUT
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


        const events = [

            'keydown',

            'keypress',

            'keyup'

        ];


        events.forEach(
            function (type) {

                element.dispatchEvent(

                    new KeyboardEvent(
                        type,
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
        );

    }


    /* =========================================================
       INSERT EMAIL BODY
       
       Gmail signature is preserved.

       Body:
       Line 1
       Line 2
       Line 3

       [ONE BR]

       Gmail Signature
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

                .replace(
                    /\r\n/g,
                    '\n'
                )

                .replace(
                    /\r/g,
                    '\n'
                )

                .replace(
                    /\n+$/,
                    ''
                );


        /*
         * Clear editor.
         */

        while (
            editor.firstChild
        ) {

            editor.removeChild(
                editor.firstChild
            );

        }


        /*
         * Add body line-by-line.
         */

        const lines =
            text.split('\n');


        lines.forEach(
            function (
                line,
                index
            ) {

                if (
                    line.length > 0
                ) {

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
         * Add exactly ONE BR
         * before existing signature.
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

                    inputType:
                        'insertText',

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

    function findSendButton(
        compose
    ) {

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
       SEND ONE EMAIL
    ========================================================= */

    async function sendOne(row) {

        status(

            'Opening Compose...\n\n' +
            row.email

        );


        const compose =
            await openCompose();


        await sleep(500);


        /* =====================================================
           RECIPIENT
        ===================================================== */

        const to =

            compose.querySelector(
                'input[aria-label*="Recipients" i]'
            )

            ||

            compose.querySelector(
                'input[placeholder*="Recipients" i]'
            )

            ||

            compose.querySelector(
                'input[peoplekit-id]'
            )

            ||

            compose.querySelector(
                'input[type="text"]'
            );


        /* =====================================================
           SUBJECT
        ===================================================== */

        const subject =
            compose.querySelector(
                'input[name="subjectbox"]'
            );


        /* =====================================================
           BODY
        ===================================================== */

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
           ENTER RECIPIENT
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
           ENTER SUBJECT
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
           ENTER BODY
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
       START MAILER
    ========================================================= */

    async function startMailer() {

        if (running) {

            return;

        }


        if (!rows.length) {

            alert(
                'Load your CSV file first.'
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


            /* =================================================
               DELAY BETWEEN EMAILS
            ================================================= */

            const delayInput =
                document.getElementById(
                    'co-delay'
                );


            const delay =
                Math.max(

                    2000,

                    Number(
                        delayInput.value
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


            await sleep(
                delay
            );

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
                'No CSV loaded.'
            );

        }

    }


    /* =========================================================
       INITIALIZE
    ========================================================= */

    function init() {

        removeOldUI();

        addStyles();

        createPanel();

        createToggle();


        console.log(
            'COLD OUTREACHER v20.0 LOADED'
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


            if (
                !document.getElementById(
                    'co-toggle'
                )
            ) {

                createToggle();

            }

        },

        1000

    );

})();