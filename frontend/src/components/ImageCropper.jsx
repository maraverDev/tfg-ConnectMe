import Cropper from 'react-easy-crop';
import { useCallback, useState } from 'react';
import getCroppedImg from '../utils/cropImage.js'; // Este archivo lo crearemos luego

function ImageCropper({ image, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(async (_, croppedAreaPixels) => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    onCropComplete(croppedImage); // Pasamos la imagen recortada
  }, [image, onCropComplete]);

  return (
    <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={3 / 2} // Relación igual que tus posts
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        objectFit="cover"
      />
    </div>
  );
}

export default ImageCropper;
