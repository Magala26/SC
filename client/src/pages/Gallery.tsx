import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import { Upload, X } from 'lucide-react';
import { galleryImages as uploadedGalleryImages } from '@/data/sneakercareImages';

export default function Gallery() {
  const { user } = useAuth();
  const { data: galleryImages = [], refetch } = trpc.sneaker.gallery.list.useQuery();
  const uploadImage = trpc.sneaker.gallery.upload.useMutation();
  const deleteImage = trpc.sneaker.gallery.delete.useMutation();

  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const isAdmin = user?.role === 'admin';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        await uploadImage.mutateAsync({
          fileData: base64,
          fileName: selectedFile.name,
          caption: caption || undefined,
        });

        toast.success('Image uploaded successfully!');
        setSelectedFile(null);
        setPreview('');
        setCaption('');
        refetch();
      };
      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const handleDelete = async (imageId: number) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage.mutateAsync({ id: imageId });
        toast.success('Image deleted successfully!');
        refetch();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete image');
      }
    }
  };

  const staticGalleryImages = uploadedGalleryImages;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">Gallery</h1>
          <p className="text-lg">Before and after showcases of our sneaker care work.</p>
        </div>
      </section>

      {/* Red Divider */}
      <div className="red-divider" />

      {/* Static Gallery Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl font-bold uppercase mb-4">Our Work</h2>
            <p className="text-muted text-lg max-w-2xl">
              Browse through our premium sneaker care results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {staticGalleryImages.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/5] overflow-hidden bg-blue-50">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-[#bf616a] to-[#0b0d12]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-white font-bold uppercase tracking-wider text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{image.caption}</p>
                  <p className="text-white/80 text-xs capitalize">{image.category.replace('-', ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Red Divider */}
      <div className="red-divider" />

      {/* Admin Upload Section */}
      {isAdmin && (
        <section className="bg-background py-16 md:py-24">
          <div className="container max-w-2xl">
            <h2 className="mb-8">Upload Gallery Image</h2>
            <form onSubmit={handleUpload} className="space-y-6 border-2 border-accent p-8">
              <div>
                <label className="block font-bold uppercase mb-3">Select Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full border-2 border-foreground bg-background p-3"
                  required
                />
              </div>

              {preview && (
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-full max-h-64 object-cover border-2 border-foreground" />
              <button
                type="button"
                onClick={() => {
                  setPreview('');
                  setSelectedFile(null);
                }}
                className="absolute top-2 right-2 bg-accent text-background p-2"
              >
                <X size={20} />
              </button>
                </div>
              )}

              <div>
                <label className="block font-bold uppercase mb-3">Caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe this image..."
                  className="w-full border-2 border-foreground bg-background p-3"
                />
              </div>

              <button
                type="submit"
                disabled={uploadImage.isPending}
                className="btn-primary w-full font-bold uppercase flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Upload size={20} />
                {uploadImage.isPending ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>
          </div>
        </section>
      )}


    </Layout>
  );
}
