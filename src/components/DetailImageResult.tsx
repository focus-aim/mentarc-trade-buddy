const MOCK_DETAIL_IMAGES: Record<string, string[]> = {
  "产品海报主图": [
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600166898405-da9535204843?w=300&h=400&fit=crop",
  ],
  "产品细节参数图": [
    "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=400&fit=crop",
  ],
  "多场景效果图": [
    "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=400&fit=crop",
  ],
};

interface DetailImageResultProps {
  types: string[];
}

const DetailImageResult = ({ types }: DetailImageResultProps) => {
  return (
    <div className="space-y-4 text-base leading-relaxed">
      <p className="text-foreground">
        已根据您选择的类型，生成以下产品详情图：
      </p>
      {types.map((type) => {
        const images = MOCK_DETAIL_IMAGES[type] || [];
        return (
          <div key={type} className="space-y-2">
            <p className="font-medium text-foreground">{type}</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="w-[130px] h-[170px] shrink-0 rounded-xl overflow-hidden border border-border bg-muted/30"
                >
                  <img
                    src={src}
                    alt={`${type} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DetailImageResult;
