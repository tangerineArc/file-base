export default function buildFolderTree(folders) {
  const folderMap = new Map();

  let root = { id: "root", name: "root", children: [] };

  folders.forEach((folder) => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });

  folders.forEach((folder) => {
    if (folder.parentFolderId) {
      const parent = folderMap.get(folder.parentFolderId);
      if (parent) {
        parent.children.push(folderMap.get(folder.id));
      }
    } else {
      root.children.push(folderMap.get(folder.id));
    }
  });

  return JSON.parse(JSON.stringify(root));
}
