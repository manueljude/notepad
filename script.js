/* ==============================
   ELEMENTS
============================== */

const newNoteBtn =
    document.getElementById("newNoteBtn");

const notesList =
    document.getElementById("notesList");

const foldersList =
    document.getElementById("foldersList");

const titleInput =
    document.getElementById("titleInput");

const contentInput =
    document.getElementById("contentInput");

const deleteBtn =
    document.getElementById("deleteBtn");

const pinBtn =
    document.getElementById("pinBtn");

const colorBtn =
    document.getElementById("colorBtn");

const colorMenu =
    document.getElementById("colorMenu");

const searchInput =
    document.getElementById("searchInput");

const wordCount =
    document.getElementById("wordCount");

const saveStatus =
    document.getElementById("saveStatus");

const themeBtn =
    document.getElementById("themeBtn");

const menuBtn =
    document.getElementById("menuBtn");

const app =
    document.querySelector(".app");

const addFolderBtn =
    document.getElementById("addFolderBtn");

const folderModal =
    document.getElementById("folderModal");

const folderNameInput =
    document.getElementById("folderNameInput");

const saveFolder =
    document.getElementById("saveFolder");

const cancelFolder =
    document.getElementById("cancelFolder");

const exportBtn =
    document.getElementById("exportBtn");

const importBtn =
    document.getElementById("importBtn");

const importFile =
    document.getElementById("importFile");


/* ==============================
   DATA
============================== */

let notes =
    JSON.parse(
        localStorage.getItem("notesPro")
    ) || [];

let folders =
    JSON.parse(
        localStorage.getItem("foldersPro")
    ) || ["General"];

let currentNoteId = null;

let currentFolder = "All";


/* ==============================
   SAVE DATA
============================== */

function saveData() {

    localStorage.setItem(
        "notesPro",
        JSON.stringify(notes)
    );

    localStorage.setItem(
        "foldersPro",
        JSON.stringify(folders)
    );

    saveStatus.textContent = "Saved";
}


/* ==============================
   CREATE NOTE
============================== */

function createNote() {

    const note = {

        id: Date.now(),

        title: "New Note",

        content: "",

        folder: "General",

        color: "#ffffff",

        pinned: false,

        date: new Date().toLocaleString()

    };

    notes.unshift(note);

    currentNoteId =
        note.id;

    saveData();

    renderFolders();

    renderNotes();

    loadNote(note.id);

    openEditor();
}


/* ==============================
   LOAD NOTE
============================== */

function loadNote(id) {

    const note =
        notes.find(
            n => n.id === id
        );

    if (!note) return;

    currentNoteId =
        id;

    titleInput.value =
        note.title;

    contentInput.innerHTML =
        note.content;

    contentInput.style.backgroundColor =
        note.color || "#ffffff";

    updateWordCount();

    renderNotes();
}


/* ==============================
   UPDATE NOTE
============================== */

function updateNote() {

    const note =
        notes.find(
            n => n.id === currentNoteId
        );

    if (!note) return;

    note.title =
        titleInput.value.trim() ||
        "Untitled";

    note.content =
        contentInput.innerHTML;

    note.date =
        new Date().toLocaleString();

    saveData();

    renderNotes();

    updateWordCount();
}


/* ==============================
   RENDER FOLDERS
============================== */

function renderFolders() {

    foldersList.innerHTML = "";

    createFolderElement(
        "📋",
        "All",
        currentFolder === "All"
    );

    folders.forEach(folder => {

        createFolderElement(
            "📁",
            folder,
            currentFolder === folder
        );

    });
}


function createFolderElement(
    icon,
    name,
    active
) {

    const div =
        document.createElement("div");

    div.className =
        "folder";

    if (active) {

        div.classList.add(
            "active"
        );

    }

    div.innerHTML = `
        <span>${icon}</span>
        <span>${escapeHTML(name)}</span>
    `;

    div.addEventListener(
        "click",
        () => {

            currentFolder =
                name;

            renderFolders();

            renderNotes();

        }
    );

    foldersList.appendChild(div);
}


/* ==============================
   RENDER NOTES
============================== */

function renderNotes() {

    notesList.innerHTML = "";

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    let filtered =
        notes.filter(note => {

            const matchesSearch =
                note.title
                    .toLowerCase()
                    .includes(search) ||

                note.content
                    .toLowerCase()
                    .includes(search);

            const matchesFolder =
                currentFolder === "All" ||
                note.folder === currentFolder;

            return (
                matchesSearch &&
                matchesFolder
            );

        });


    // Pinned notes first

    filtered.sort(
        (a, b) =>
            Number(b.pinned) -
            Number(a.pinned)
    );


    filtered.forEach(note => {

        const div =
            document.createElement("div");

        div.className =
            "note";

        if (
            note.id === currentNoteId
        ) {

            div.classList.add(
                "active"
            );

        }

        div.style.borderLeftColor =
            note.color;


        const preview =
            stripHTML(
                note.content
            );


        div.innerHTML = `

            <div class="note-title">

                <span>
                    ${escapeHTML(
                        note.title ||
                        "Untitled"
                    )}
                </span>

                ${
                    note.pinned
                        ? `<span class="pin">📌</span>`
                        : ""
                }

            </div>

            <div class="note-preview">
                ${escapeHTML(
                    preview ||
                    "Empty note"
                )}
            </div>

        `;


        div.addEventListener(
            "click",
            () => {

                loadNote(
                    note.id
                );

                openEditor();

            }
        );


        notesList.appendChild(div);

    });
}


/* ==============================
   DELETE NOTE
============================== */

deleteBtn.addEventListener(
    "click",
    () => {

        if (
            currentNoteId === null
        ) return;

        if (
            !confirm(
                "Delete this note?"
            )
        ) return;

        notes =
            notes.filter(
                note =>
                    note.id !==
                    currentNoteId
            );

        currentNoteId =
            null;

        saveData();

        renderNotes();

        if (notes.length > 0) {

            loadNote(
                notes[0].id
            );

        } else {

            titleInput.value =
                "";

            contentInput.innerHTML =
                "";

            updateWordCount();

        }

    }
);


/* ==============================
   PIN NOTE
============================== */

pinBtn.addEventListener(
    "click",
    () => {

        const note =
            getCurrentNote();

        if (!note) return;

        note.pinned =
            !note.pinned;

        pinBtn.textContent =
            note.pinned
                ? "📌"
                : "📍";

        saveData();

        renderNotes();

    }
);


/* ==============================
   COLORS
============================== */

colorBtn.addEventListener(
    "click",
    () => {

        colorMenu.classList.toggle(
            "show"
        );

    }
);


document
    .querySelectorAll(
        ".color-menu button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const note =
                    getCurrentNote();

                if (!note) return;

                const color =
                    button.dataset.color;

                note.color =
                    color;

                contentInput.style.backgroundColor =
                    color;

                colorMenu.classList.remove(
                    "show"
                );

                saveData();

                renderNotes();

            }
        );

    });


/* ==============================
   FORMATTING
============================== */

document
    .querySelectorAll(
        ".format-bar button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const command =
                    button.dataset.command;

                const value =
                    button.dataset.value ||
                    null;

                document.execCommand(
                    command,
                    false,
                    value
                );

                contentInput.focus();

                updateNote();

            }
        );

    });


/* ==============================
   WORD COUNT
============================== */

function updateWordCount() {

    const text =
        stripHTML(
            contentInput.innerHTML
        ).trim();

    if (!text) {

        wordCount.textContent =
            "0 words";

        return;

    }

    const words =
        text.split(
            /\s+/
        );

    wordCount.textContent =
        `${words.length} words`;
}


/* ==============================
   SEARCH
============================== */

searchInput.addEventListener(
    "input",
    renderNotes
);


/* ==============================
   NEW NOTE
============================== */

newNoteBtn.addEventListener(
    "click",
    createNote
);


/* ==============================
   AUTO SAVE
============================== */

titleInput.addEventListener(
    "input",
    updateNote
);

contentInput.addEventListener(
    "input",
    updateNote
);


/* ==============================
   FOLDERS
============================== */

addFolderBtn.addEventListener(
    "click",
    () => {

        folderModal.classList.add(
            "show"
        );

        folderNameInput.focus();

    }
);


cancelFolder.addEventListener(
    "click",
    () => {

        folderModal.classList.remove(
            "show"
        );

        folderNameInput.value =
            "";

    }
);


saveFolder.addEventListener(
    "click",
    createFolder
);


folderNameInput.addEventListener(
    "keydown",
    e => {

        if (
            e.key === "Enter"
        ) {

            createFolder();

        }

    }
);


function createFolder() {

    const name =
        folderNameInput.value.trim();

    if (!name) return;

    if (
        folders.includes(name)
    ) {

        alert(
            "This folder already exists."
        );

        return;

    }

    folders.push(name);

    saveData();

    currentFolder =
        name;

    renderFolders();

    renderNotes();

    folderModal.classList.remove(
        "show"
    );

    folderNameInput.value =
        "";

}


/* ==============================
   MOBILE MENU
============================== */

menuBtn.addEventListener(
    "click",
    () => {

        app.classList.remove(
            "editor-open"
        );

    }
);


function openEditor() {

    app.classList.add(
        "editor-open"
    );

}


/* ==============================
   DARK MODE
============================== */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        const dark =
            document.body.classList.contains(
                "dark"
            );

        localStorage.setItem(
            "darkModePro",
            dark
        );

        themeBtn.textContent =
            dark
                ? "☀️"
                : "🌙";

    }
);


if (
    localStorage.getItem(
        "darkModePro"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent =
        "☀️";

}


/* ==============================
   EXPORT
============================== */

exportBtn.addEventListener(
    "click",
    () => {

        const data = {

            notes: notes,

            folders: folders

        };


        const blob =
            new Blob(
                [
                    JSON.stringify(
                        data,
                        null,
                        2
                    )
                ],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );

        link.href =
            url;

        link.download =
            "notepad-backup.json";

        link.click();

        URL.revokeObjectURL(
            url
        );

    }
);


/* ==============================
   IMPORT
============================== */

importBtn.addEventListener(
    "click",
    () => {

        importFile.click();

    }
);


importFile.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) return;


        const reader =
            new FileReader();


        reader.onload =
            e => {

                try {

                    const data =
                        JSON.parse(
                            e.target.result
                        );


                    if (
                        !Array.isArray(
                            data.notes
                        ) ||
                        !Array.isArray(
                            data.folders
                        )
                    ) {

                        throw new Error();

                    }


                    notes =
                        data.notes;

                    folders =
                        data.folders;


                    saveData();

                    renderFolders();

                    renderNotes();


                    if (
                        notes.length
                    ) {

                        loadNote(
                            notes[0].id
                        );

                    }


                    alert(
                        "Notes imported successfully!"
                    );

                }

                catch {

                    alert(
                        "Invalid notepad backup file."
                    );

                }

            };


        reader.readAsText(
            file
        );

        importFile.value =
            "";

    }
);


/* ==============================
   HELPERS
============================== */

function getCurrentNote() {

    return notes.find(
        note =>
            note.id ===
            currentNoteId
    );

}


function stripHTML(html) {

    const temp =
        document.createElement(
            "div"
        );

    temp.innerHTML =
        html;

    return temp.textContent ||
        temp.innerText ||
        "";

}


function escapeHTML(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==============================
   START APP
============================== */

renderFolders();

renderNotes();


if (notes.length > 0) {

    loadNote(
        notes[0].id
    );

} else {

    createNote();

}