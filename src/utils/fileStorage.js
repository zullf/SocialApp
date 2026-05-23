import { File, Paths } from 'expo-file-system';

const CHECKLIST_FILE_NAME = 'socialapp-checklist.json';

function getChecklistFile() {
  return new File(Paths.document, CHECKLIST_FILE_NAME);
}

export async function writeChecklistJson(data) {
  const file = getChecklistFile();
  const payload = JSON.stringify(data, null, 2);

  if (!file.exists) {
    file.create();
  }

  file.write(payload);
  return file.uri;
}

export async function readChecklistJson() {
  const file = getChecklistFile();
  if (!file.exists) return null;

  const contents = await file.text();
  return JSON.parse(contents);
}

export async function runChecklistJsonDemo() {
  const writtenData = {
    app: 'SocialApp',
    feature: 'File System JSON',
    status: 'written-and-read',
    savedAt: new Date().toISOString(),
  };

  const uri = await writeChecklistJson(writtenData);
  const readData = await readChecklistJson();

  return {
    ok: readData?.status === writtenData.status,
    uri,
    data: readData,
  };
}
