import React, { useState, ChangeEvent } from "react";
import { storage } from "../firebase/firebaseConfig";
import { UploadTaskSnapshot } from "@firebase/storage-types";
import { FirebaseStorage, ref, uploadBytes } from "firebase/storage";
//import { FirebaseError } from "@firebase/app-types";

const UploadFile: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);

      const storageRef = ref(storage);
      const fileRef = ref(storageRef, uploadedFile.name);

      uploadBytes(fileRef, uploadedFile)
        .then((snapshot: any) => {
          console.log("Plik przesłany!");
          // Możesz wykonać dodatkowe operacje, jeśli potrzebujesz
        })
        .catch((error: Error) => {
          console.error("Błąd przesyłania pliku:", error);
        });
    }
  };

  return (
    <input
      type="file"
      onChange={handleFileUpload}
    />
  );
};

export default UploadFile;
