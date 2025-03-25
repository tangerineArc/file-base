(() => {
  const shareFileDialogs = document.querySelectorAll(".share-file-dialog");

  shareFileDialogs.forEach((dialog) => {
    const fileId = dialog.dataset.id;

    const durationsButtons = dialog.querySelectorAll(
      ".durations-group > button"
    );

    const publicUrlInput = dialog.querySelector(".public-url");
    const copyButton = dialog.querySelector(".copy-button");

    durationsButtons.forEach((button) => {
      button.addEventListener("click", () => {
        durationsButtons.forEach((_btn) => {
          _btn.classList.remove("selected");
        });

        publicUrlInput.value = "";
        button.classList.add("selected");
        copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        `;
      });
    });

    const generateLinkButton = dialog.querySelector(".modal-submit-button");

    const url = new URL(window.location.href);

    generateLinkButton.addEventListener("click", async () => {
      copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      `;

      if (publicUrlInput.value !== "") return;

      generateLinkButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      `;

      const response = await fetch(
        `${url.origin}/folders/make-file-public/${fileId}`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visibilityDuration: dialog.querySelector(
              ".durations-group > button.selected"
            ).dataset.duration,
          }),
        }
      );
      const { url: publicUrl } = await response.json();

      publicUrlInput.value = publicUrl;

      generateLinkButton.innerText = "Get Link";
    });

    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(publicUrlInput.value);
      copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
      `;
    });
  });
})();
