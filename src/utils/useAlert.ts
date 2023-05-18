import { useCallback } from "react";
import { useToast, UseToastOptions } from "@chakra-ui/react";

const useAlert = () => {
  const toast = useToast();

  const showAlert = useCallback(
    (message: string, status: "success" | "error") => {
      // Wyświetlanie komunikatu w zależności od statusu
      const options: UseToastOptions = {
        title: message,
        status: status,
        duration: 5000,
        isClosable: true,
      };

      toast(options);
    },
    [toast]
  );

  return showAlert;
};

export default useAlert;
