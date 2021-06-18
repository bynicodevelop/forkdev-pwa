export const getExtension = (file) => {
  const fileNameExploded = file.name.split('.')
  return fileNameExploded[1] ?? null
}

export const getFileName = (ext) => `${Date.now()}.${ext}`

export const uploadFile = async (file, fire) => {
  // TODO: Et si l'extension est null ???
  // TODO: Penser à changer le chemin pour que ce soit dans un dossier utilisateur
  const ref = fire.storage.ref(`uploads/${getFileName(getExtension(file))}`)

  await ref.put(file)

  return await ref.getDownloadURL()
}
