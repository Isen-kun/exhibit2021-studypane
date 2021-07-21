import { useEffect } from "react";
import { useState } from "react";
import { projectFirestore } from "../Firebase/config";

const useFirestoreTask = (CurrentUserID) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (CurrentUserID) {
      const unsub = projectFirestore
        .collection("tasks")
        .where("ownerId", "==", CurrentUserID)
        .orderBy("createdAt", "asc")
        .onSnapshot((snap) => {
          let documents = [];
          snap.forEach((doc) => {
            documents.push({ ...doc.data(), id: doc.id });
          });
          setDocs(documents);
        });
      return () => unsub();
    }
  }, [CurrentUserID]);
  return { docs };
};

export default useFirestoreTask;
