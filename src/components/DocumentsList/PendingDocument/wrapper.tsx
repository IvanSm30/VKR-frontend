import React, { useEffect, useState } from "react";
import NotificationComponent from "src/components/Notification";
import PendingDocuments from ".";
import { useAppSelector } from "src/store/hooks";

const PendingDocumentsWrapper: React.FC = () => {
  const pendingFiles = useAppSelector(state => state.files.pendingFiles);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (pendingFiles.length > 0) {
      setShowNotification(true);
    }
  }, [pendingFiles.length]);

  return (
    <>
      {showNotification && <NotificationComponent text="У вас есть входящие документы!" />}
      <PendingDocuments />
    </>
  );
};

export default PendingDocumentsWrapper;
