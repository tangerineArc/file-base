const loader = document.querySelector("nav > span");

(() => {
  document.body.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (document.body.classList.contains("drawer-open") && document.body.classList.contains("modal-open")) {
        document.body.classList.remove("modal-open");
      } else {
        document.body.classList.remove("drawer-open");
        document.body.classList.remove("modal-open");
      }
    }
  });

  const newFolderButton = document.querySelector("#new-folder-button");

  const dialog = document.querySelector("#new-folder-dialog");

  newFolderButton.addEventListener("click", () => {
    dialog.showModal();
    document.body.classList.add("modal-open");
  });

  dialog.querySelector(".modal-submit-button").addEventListener("click", () => {
    dialog.close();
    loader.classList.add("loading");
  });

  dialog.querySelector(".modal-cancel-button").addEventListener("click", () => {
    dialog.close();
    document.body.classList.remove("modal-open");
  });
})();

(() => {
  const newFileButton = document.querySelector("#new-file-button");

  const dialog = document.querySelector("#new-file-dialog");

  newFileButton.addEventListener("click", () => {
    dialog.showModal();
    document.body.classList.add("modal-open");
  });

  dialog.querySelector(".modal-submit-button").addEventListener("click", () => {
    dialog.close();
    loader.classList.add("loading");
  });

  dialog.querySelector(".modal-cancel-button").addEventListener("click", () => {
    dialog.close();
    document.body.classList.remove("modal-open");
  });
})();

(() => {
  const shareFileButtons = document.querySelectorAll(".share-file-button");

  shareFileButtons.forEach((button) => {
    const shareFileDialog = button.nextElementSibling;

    button.addEventListener("click", () => {
      shareFileDialog.showModal();
      document.body.classList.add("modal-open");
    });

    const modalCancelButton = shareFileDialog.querySelector(
      ".modal-cancel-button"
    );

    modalCancelButton.addEventListener("click", () => {
      shareFileDialog.close();
      document.body.classList.remove("modal-open");
    });
  });
})();

(() => {
  const deleteFileButtons = document.querySelectorAll(".delete-file-button");

  deleteFileButtons.forEach((button) => {
    const deleteFileDialog = button.nextElementSibling;

    button.addEventListener("click", () => {
      deleteFileDialog.showModal();
      document.body.classList.add("modal-open");
    });

    deleteFileDialog
      .querySelector(".modal-submit-button")
      .addEventListener("click", () => {
        deleteFileDialog.close();
        button.disabled = true;
        loader.classList.add("loading");
      });

    deleteFileDialog
      .querySelector(".modal-cancel-button")
      .addEventListener("click", () => {
        deleteFileDialog.close();
        document.body.classList.remove("modal-open");
      });
  });
})();

(() => {
  const deleteFolderButtons = document.querySelectorAll(
    ".delete-folder-button"
  );

  deleteFolderButtons.forEach((button) => {
    const deleteFolderDialog = button.nextElementSibling;

    button.addEventListener("click", () => {
      deleteFolderDialog.showModal();
      document.body.classList.add("modal-open");
    });

    deleteFolderDialog
      .querySelector(".modal-submit-button")
      .addEventListener("click", () => {
        deleteFolderDialog.close();
        button.disabled = true;
        loader.classList.add("loading");
      });

    deleteFolderDialog
      .querySelector(".modal-cancel-button")
      .addEventListener("click", () => {
        deleteFolderDialog.close();
        document.body.classList.remove("modal-open");
      });
  });
})();
