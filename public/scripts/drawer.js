(() => {
  document.querySelectorAll(".folder").forEach((folder) => {
    const sidebar = folder.querySelector(".sidebar");

    folder.addEventListener("click", () => {
      sidebar.showModal();
      document.body.classList.add("drawer-open");
    });

    folder.querySelector("a").addEventListener("click", (event) => {
      event.stopPropagation();
    });

    sidebar
      .querySelector(".close-button")
      .addEventListener("click", (event) => {
        event.stopPropagation();
        sidebar.close();
        document.body.classList.remove("drawer-open");
      });
  });
})();

(() => {
  document.querySelectorAll(".file").forEach((file) => {
    const sidebar = file.querySelector(".sidebar");

    file.addEventListener("click", () => {
      sidebar.showModal();
      document.body.classList.add("drawer-open");
    });

    sidebar
      .querySelector(".close-button")
      .addEventListener("click", (event) => {
        event.stopPropagation();
        sidebar.close();
        document.body.classList.remove("drawer-open");
      });
  });
})();
