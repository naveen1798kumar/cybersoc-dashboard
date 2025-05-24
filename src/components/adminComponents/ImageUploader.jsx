import React from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUploader = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <div {...getRootProps()} className="cursor-pointer border-dashed border-2 p-4 text-center">
      <input {...getInputProps()} />
      <p>Drag and drop an image here, or click to select files</p>
    </div>
  );
};

export default ImageUploader;
