import React, { createContext, useContext, useState } from "react";
import { ImageModal } from "../components/ImageModal";

interface ImageModalContextType {
  openImage: (url: string, alt: string) => void;
}

const ImageModalContext = createContext<ImageModalContextType | undefined>(undefined);

export const ImageModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  const openImage = (url: string, alt: string) => {
    setSelectedImage({ url, alt });
  };

  return (
    <ImageModalContext.Provider value={{ openImage }}>
      {children}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage.url}
          altText={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </ImageModalContext.Provider>
  );
};

export const useImageModal = () => {
  const context = useContext(ImageModalContext);
  if (!context) {
    throw new Error("useImageModal must be used within an ImageModalProvider");
  }
  return context;
};
