import { useState, useEffect, useRef } from "react";
import { 
  Sliders, Square, Type, Trash2, Sun, Contrast, 
  Droplet, Download, Layers, Type as FontIcon, Upload, Eye, Thermometer, Sparkles, Target, Wand2
} from "lucide-react";

// ✅ Fabric.js v6 Correct Named Imports
import { 
  Canvas, 
  FabricImage, 
  Circle, 
  IText,
  filters,
  Object as FabricObject
} from "fabric";

const FONTS_LIST = ["sans-serif", "serif", "monospace", "Courier New", "Comic Sans MS", "Impact"];

const Editor = () => {
  const [activeTab, setActiveTab] = useState<"adjust" | "elements" | "layers">("adjust");
  
  // Core Lightroom Sliders
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);    
  const [saturation, setSaturation] = useState<number>(0);  
  
  // Advanced Color Controls
  const [temperature, setTemperature] = useState<number>(0);
  const [vibrance, setVibrance] = useState<number>(0);       

  // ✨ DSLR Portrait Blur Controls
  const [bgBlur, setBgBlur] = useState<number>(0); 
  const [focusRadius, setFocusRadius] = useState<number>(80); 

  // Typography States
  const [selectedFont, setSelectedFont] = useState<string>("sans-serif");
  const [textColor, setTextColor] = useState<string>("#ec4899");

  // Layers State
  const [canvasObjects, setCanvasObjects] = useState<FabricObject[]>([]);

  // ✨ AI Magic Prompt State
  const [aiPrompt, setAiPrompt] = useState<string>(""); 

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  
  // ✨ Layers Tracking Refs
  const bgImgRef = useRef<FabricImage | null>(null);   
  const fgImgRef = useRef<FabricImage | null>(null);   
  const maskControlRef = useRef<Circle | null>(null); 

  const [enhancing, setEnhancing] = useState(false);

  // 1. Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // ✅ Fabric v6 Instance Creation
    const canvas = new Canvas(canvasRef.current, {
      width: 380,
      height: 380,
      backgroundColor: "#171717",
    });

    if (window.innerWidth >= 768) {
      canvas.setDimensions({ width: 450, height: 450 });
    }

    fabricCanvasRef.current = canvas;
    canvas.renderAll();

    const updateLayers = () => {
      setCanvasObjects([...canvas.getObjects()]);
    };

    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("selection:created", updateLayers);
    canvas.on("selection:updated", updateLayers);
    canvas.on("selection:cleared", updateLayers);

    // Focus Ring Event Listeners
    canvas.on("object:moving", (e) => {
      if (e.target === maskControlRef.current) {
        updateMaskPosition();
      }
    });
    
    canvas.on("object:scaling", (e) => {
      if (e.target === maskControlRef.current) {
        const target = e.target as Circle;
        const newRadius = (target.radius ?? 80) * (target.scaleX ?? 1);
        setFocusRadius(Math.round(newRadius));
        target.set({ radius: newRadius, scaleX: 1, scaleY: 1 });
        updateMaskPosition();
      }
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // ✅ SAFE CANVAS TO BLOB METHOD
  const getCanvasImageFile = (): Promise<File | null> => {
    return new Promise((resolve) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return resolve(null);

      canvas.discardActiveObject();
      canvas.renderAll();

      const canvasEl = canvas.getElement();
      if (!canvasEl) return resolve(null);

      canvasEl.toBlob((blob) => {
        if (!blob) return resolve(null);

        const file = new File([blob], `image.png`, {
          type: "image/png",
        });

        resolve(file);
      }, "image/png");
    });
  };

  // ✅ FIXED AI PHOTO ENHANCE FUNCTION WITH SEAMLESS ERROR HANDLING
  const handleAIEnhance = async () => {
    try {
      setEnhancing(true);

      const file = await getCanvasImageFile();
      if (!file) {
        alert("No active canvas image found to enhance!");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", aiPrompt); // ✨ Customer ලියන Prompt එක මෙතනින් Backend එකට යනවා

      // Backend API Call
      const res = await fetch("http://localhost:5000/api/v1/ai/enhance", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        alert("AI Server Enhancement Failed: " + (data.message || "Unknown Error"));
        return;
      }

      const enhancedImageUrl = data.result?.output?.[0];
      if (!enhancedImageUrl) {
        alert("No output image URL returned from AI");
        return;
      }

      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const loadImage = (url: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        });

      const htmlImg = await loadImage(enhancedImageUrl);

      // ✅ Fabric v6 Native Constructor Initialization
      const img = new FabricImage(htmlImg, {
        crossOrigin: "anonymous"
      });

      canvas.clear();
      canvas.backgroundColor = "#171717";

      img.scaleToWidth(canvas.width || 380);
      if ((img.getScaledHeight() ?? 0) > (canvas.height || 380)) {
        img.scaleToHeight(canvas.height || 380);
      }
      canvas.centerObject(img);
      canvas.add(img);

      // Reset layer references
      bgImgRef.current = null;
      fgImgRef.current = null;
      maskControlRef.current = null;

      // Reset sliders
      setBrightness(0);
      setContrast(0);
      setSaturation(0);
      setVibrance(0);
      setTemperature(0);
      setBgBlur(0);

      canvas.renderAll();
      setCanvasObjects([...canvas.getObjects()]);
      alert("Image processed successfully via AI! ✨");

    } catch (err) {
      console.error("AI Enhance Execution Error:", err);
      alert("Failed connecting to AI API Server endpoint.");
    } finally {
      setEnhancing(false);
    }
  };

  // ✨ UPDATE MASK POSITION
  const updateMaskPosition = () => {
    const fgImg = fgImgRef.current;
    const maskRing = maskControlRef.current;
    const canvas = fabricCanvasRef.current;

    if (!fgImg || !maskRing || !canvas) return;

    const clipCircle = new Circle({
      radius: maskRing.radius ?? focusRadius,
      left: maskRing.left ?? 0,
      top: maskRing.top ?? 0,
      originX: "center",
      originY: "center",
      absolutePositioned: true,
    });

    fgImg.set({ clipPath: clipCircle });
    canvas.requestRenderAll();
  };

  // Focus Radius Slider Trigger Effect
  useEffect(() => {
    const maskRing = maskControlRef.current;
    const canvas = fabricCanvasRef.current;
    if (!maskRing || !canvas) return;

    maskRing.set({ radius: focusRadius });
    updateMaskPosition();
    canvas.renderAll();
  }, [focusRadius]);

  // 2. Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (fEvent) => {
      const dataUrl = fEvent.target?.result as string;
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const imgElement = document.createElement("img");
      imgElement.src = dataUrl;
      
      imgElement.onload = () => {
        canvas.clear();
        canvas.backgroundColor = "#171717";

        const bgImg = new FabricImage(imgElement, {
          crossOrigin: "anonymous"
        });
        
        bgImg.scaleToWidth(canvas.width || 380);
        if ((bgImg.getScaledHeight() ?? 0) > (canvas.height || 380)) {
          bgImg.scaleToHeight(canvas.height || 380);
        }
        canvas.centerObject(bgImg);
        
        const fgImg = new FabricImage(imgElement, {
          crossOrigin: "anonymous",
          left: bgImg.left,
          top: bgImg.top,
          selectable: false, 
          evented: false
        });
        fgImg.scaleToWidth(bgImg.getScaledWidth());
        fgImg.scaleToHeight(bgImg.getScaledHeight());

        const maskRing = new Circle({
          radius: focusRadius,
          left: (canvas.width || 380) / 2,
          top: (canvas.height || 380) / 2,
          originX: "center",
          originY: "center",
          fill: "transparent",
          stroke: "#ec4899",
          strokeWidth: 3,
          strokeDashArray: [6, 4],
          cornerColor: "#f43f5e",
          cornerSize: 8,
          transparentCorners: false,
        });

        canvas.add(bgImg);
        canvas.add(fgImg);
        canvas.add(maskRing);
        canvas.setActiveObject(maskRing);

        bgImgRef.current = bgImg;
        fgImgRef.current = fgImg;
        maskControlRef.current = maskRing;

        setBrightness(0);
        setContrast(0);
        setSaturation(0);
        setVibrance(0);
        setTemperature(0);
        setBgBlur(0);

        updateMaskPosition();
        setCanvasObjects([...canvas.getObjects()]);
      };
    };
    reader.readAsDataURL(file);
  };

  // 3. Apply Filters
  useEffect(() => {
    const bgImg = bgImgRef.current;
    const fgImg = fgImgRef.current;
    const canvas = fabricCanvasRef.current;
    
    if (!bgImg || !canvas) return;

    bgImg.filters = [];
    if (bgBlur > 0) {
      bgImg.filters.push(
        new filters.Blur({
          blur: Math.min(bgBlur / 5, 1),
        })
      );
    }

    const sharedFilters: any[] = [];
    if (brightness !== 0) sharedFilters.push(new filters.Brightness({ brightness }));
    if (contrast !== 0) sharedFilters.push(new filters.Contrast({ contrast }));
    if (saturation !== 0) sharedFilters.push(new filters.Saturation({ saturation }));
    if (vibrance !== 0) sharedFilters.push(new filters.Vibrance({ vibrance }));
    
    if (temperature !== 0) {
      const colorMatrix = new filters.ColorMatrix();
      colorMatrix.matrix = temperature > 0 
        ? [1 + temperature * 0.15, 0, 0, 0, 0, 0, 1 + temperature * 0.07, 0, 0, 0, 0, 0, 1 - temperature * 0.15, 0, 0, 0, 0, 0, 1, 0]
        : [1 + temperature * 0.15, 0, 0, 0, 0, 0, 1 + temperature * 0.05, 0, 0, 0, 0, 0, 1 - temperature * 0.25, 0, 0, 0, 0, 0, 1, 0];
      sharedFilters.push(colorMatrix);
    }

    bgImg.filters.push(...sharedFilters);
    bgImg.applyFilters();

    if (fgImg) {
      fgImg.filters = [...sharedFilters]; 
      fgImg.applyFilters();
    }

    canvas.requestRenderAll();
  }, [brightness, contrast, saturation, vibrance, temperature, bgBlur]);

  // 4. Typography Element Addition
  const addTextElement = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const text = new IText("Double Click to Edit", {
      left: 100,
      top: 150,
      fontFamily: selectedFont,
      fill: textColor,
      fontWeight: "bold",
      fontSize: 30
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("fontFamily", selectedFont);
      activeObject.set("fill", textColor);
      canvas.renderAll();
    }
  }, [selectedFont, textColor]);

  // 5. Delete Selected Object
  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.getActiveObjects().forEach((obj) => {
      if (obj === bgImgRef.current || obj === fgImgRef.current) return;
      canvas.remove(obj);
    });
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const selectObjectFromLayer = (obj: FabricObject) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };

  // 7. Export High-Quality PNG
  const handleDownloadPng = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const maskRing = maskControlRef.current;
    if (maskRing) maskRing.set({ opacity: 0 });

    canvas.discardActiveObject();
    canvas.renderAll();

    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 4,
    });

    if (maskRing) maskRing.set({ opacity: 1 });
    canvas.renderAll();

    const link = document.createElement("a");
    link.download = `DSLR-Portrait-Edit-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleSaveFabricJson = () => {
    if (!fabricCanvasRef.current) return;
    console.log("Fabric.json Data Structure:", JSON.stringify(fabricCanvasRef.current.toJSON(), null, 2));
    alert("Fabric JSON printed to Browser Console!");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] md:h-[calc(100vh-5rem)] flex flex-col md:flex-row bg-[#030508] text-slate-200 overflow-y-auto md:overflow-hidden font-sans">
      
      {/* ─── LEFT SIDEBAR (TABS) ─── */}
      <aside className="w-full md:w-20 bg-neutral-950 border-b md:border-b-0 md:border-r border-neutral-900 flex flex-row md:flex-col items-center justify-between p-4 md:py-6 z-20">
        <div className="flex flex-row md:flex-col gap-4 md:gap-6 w-full justify-center md:justify-start px-2">
          <button 
            onClick={() => setActiveTab("adjust")}
            className={`p-2.5 md:p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === "adjust" ? "bg-pink-500/10 text-pink-500 border border-pink-500/20" : "text-neutral-500 hover:text-slate-200"}`}
          >
            <Sliders className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wider uppercase hidden md:inline">Adjust</span>
          </button>

          <button 
            onClick={() => setActiveTab("elements")}
            className={`p-2.5 md:p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === "elements" ? "bg-pink-500/10 text-pink-500 border border-pink-500/20" : "text-neutral-500 hover:text-slate-200"}`}
          >
            <Square className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wider uppercase hidden md:inline">Elements</span>
          </button>

          <button 
            onClick={() => setActiveTab("layers")}
            className={`p-2.5 md:p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === "layers" ? "bg-pink-500/10 text-pink-500 border border-pink-500/20" : "text-neutral-500 hover:text-slate-200"}`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wider uppercase hidden md:inline">Layers ({canvasObjects.length})</span>
          </button>
        </div>

        <button 
          onClick={deleteSelected}
          className="p-3 text-neutral-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all duration-300"
          title="Delete Selection"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </aside>

      {/* ─── MIDDLE CANVAS PLATFORM ─── */}
      <main className="flex-1 flex flex-col bg-[#06090f] p-4 md:p-0 min-h-[500px]">
        {/* Top Control Bar */}
        <div className="h-14 border-b border-neutral-900/60 bg-neutral-950/40 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-10 rounded-xl md:rounded-none">
          <div className="flex items-center gap-3 flex-1">
            <label className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] md:text-xs px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-bold tracking-wider uppercase cursor-pointer transition-all shrink-0">
              <Upload className="w-3.5 h-3.5 text-pink-500" />
              Upload Photo
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {/* ✨ NEW: AI MAGIC PROMPT DYNAMIC INPUT BOX */}
            <div className="hidden sm:flex items-center relative flex-1 max-w-xs md:max-w-sm">
              <input
                type="text"
                placeholder="Describe AI changes (e.g., make it a 90s vintage portrait)..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={enhancing || canvasObjects.length === 0}
                className="w-full bg-neutral-900/80 border border-neutral-800/80 text-[11px] md:text-xs px-3.5 py-2 rounded-xl text-slate-200 outline-none focus:border-orange-500/50 transition-all disabled:opacity-40"
              />
            </div>

            {/* ✨ NATIVE SERVER-SIDE AI ENHANCE TRIGGER */}
            <button
              onClick={handleAIEnhance}
              disabled={enhancing || canvasObjects.length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 text-neutral-950 disabled:opacity-40 disabled:cursor-not-allowed text-[11px] md:text-xs px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-black tracking-wider uppercase shadow-md shadow-orange-500/10 transition-all shrink-0"
            >
              <Wand2 className={`w-3.5 h-3.5 ${enhancing ? "animate-spin" : ""}`} />
              {enhancing ? "Processing..." : "AI Edit ✨"}
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button 
              onClick={handleSaveFabricJson}
              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 px-3 py-1.5 rounded-lg text-[11px] md:text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all"
            >
              Save JSON
            </button>
            <button 
              onClick={handleDownloadPng}
              className="bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:opacity-90 text-white px-3 py-1.5 md:px-4 md:py-1.5 rounded-xl text-[11px] md:text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-pink-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export PNG
            </button>
          </div>
        </div>

        {/* Mobile Input Box (Responsive view එකේදී විතරක් පේන්න) */}
        <div className="block sm:hidden px-4 pt-2">
          <input
            type="text"
            placeholder="Describe AI changes..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={enhancing || canvasObjects.length === 0}
            className="w-full bg-neutral-900 border border-neutral-800 text-xs px-3 py-2 rounded-xl text-slate-200 outline-none focus:border-orange-500 transition-all disabled:opacity-40"
          />
        </div>

        {/* Live Canvas Window */}
        <div className="flex-1 flex items-center justify-center py-6 md:p-8 relative overflow-hidden">
          <div className="absolute w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="p-1.5 bg-neutral-900 border border-white/5 rounded-2xl shadow-2xl max-w-full overflow-auto">
            <canvas ref={canvasRef} className="rounded-xl max-w-full" />
          </div>
        </div>
      </main>

      {/* ─── RIGHT CONTROL PANEL ─── */}
      <aside className="w-full md:w-80 bg-neutral-950 border-t md:border-t-0 md:border-l border-neutral-900 p-6 flex flex-col gap-8 z-20">
        
        {/* TAB 1: ADJUST CONTROLS */}
        {activeTab === "adjust" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xs font-black tracking-widest uppercase text-pink-500 mb-1 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Lightroom Pro Filters
              </h3>
              <p className="text-[10px] text-neutral-500">GPU accelerated real-time image adjustment</p>
            </div>

            <div className="space-y-5">
              
              {/* ✨ PORTRAIT BACKGROUND BLUR CONTROLS */}
              <div className="p-3 bg-neutral-900/60 rounded-xl border border-pink-500/10 space-y-4">
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" /> DSLR Portrait Mode
                </span>

                {/* Background Blur Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-400 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-neutral-500" /> Background Blur</span>
                    <span className="text-fuchsia-400 font-bold">{bgBlur}</span>
                  </div>
                  <input 
                    type="range" min="0" max="5" step="0.1" value={bgBlur} 
                    onChange={(e) => setBgBlur(parseFloat(e.target.value))}
                    className="w-full accent-fuchsia-500 bg-neutral-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Focus Ring Radius Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-400 flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-neutral-500" /> Focus Area Size</span>
                    <span className="text-pink-400 font-bold">{focusRadius}px</span>
                  </div>
                  <input 
                    type="range" min="30" max="200" step="5" value={focusRadius} 
                    onChange={(e) => setFocusRadius(parseInt(e.target.value))}
                    className="w-full accent-pink-500 bg-neutral-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <p className="text-[9px] text-neutral-500 italic">💡 Canvas එක උඩ ඇති Focus Ring එක කැමති තැනකට drag කරන්න.</p>
              </div>

              <hr className="border-neutral-900" />

              {/* Brightness */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-neutral-500" /> Brightness</span>
                  <span className="text-pink-400 font-bold">{Math.round(brightness * 100)}</span>
                </div>
                <input 
                  type="range" min="-1" max="1" step="0.05" value={brightness} 
                  onChange={(e) => setBrightness(parseFloat(e.target.value))}
                  className="w-full accent-pink-500 bg-neutral-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Contrast className="w-3.5 h-3.5 text-neutral-500" /> Contrast</span>
                  <span className="text-pink-400 font-bold">{Math.round(contrast * 100)}</span>
                </div>
                <input 
                  type="range" min="-1" max="1" step="0.05" value={contrast} 
                  onChange={(e) => setContrast(parseFloat(e.target.value))}
                  className="w-full accent-pink-500 bg-neutral-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-neutral-500" /> Temp (Warmth)</span>
                  <span className="text-pink-400 font-bold">{temperature > 0 ? `+${Math.round(temperature * 100)}` : Math.round(temperature * 100)}</span>
                </div>
                <input 
                  type="range" min="-1" max="1" step="0.05" value={temperature} 
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 bg-gradient-to-r from-blue-500 via-neutral-800 to-amber-500 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5 text-neutral-500" /> Saturation</span>
                  <span className="text-pink-400 font-bold">{Math.round(saturation * 100)}</span>
                </div>
                <input 
                  type="range" min="-1" max="1" step="0.05" value={saturation} 
                  onChange={(e) => setSaturation(parseFloat(e.target.value))}
                  className="w-full accent-pink-500 bg-neutral-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Vibrance */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-neutral-500" /> Vibrance</span>
                  <span className="text-pink-400 font-bold">{Math.round(vibrance * 100)}</span>
                </div>
                <input 
                  type="range" min="-1" max="1" step="0.05" value={vibrance} 
                  onChange={(e) => setVibrance(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 bg-neutral-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: ELEMENTS & ADVANCED TYPOGRAPHY */}
        {activeTab === "elements" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xs font-black tracking-widest uppercase text-pink-500 mb-1">Typography Tools</h3>
              <p className="text-[10px] text-neutral-500">Inject dynamic styled typography vectors</p>
            </div>

            <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800/60 space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-neutral-400 flex items-center gap-1.5">
                  <FontIcon className="w-3.5 h-3.5" /> Font Family
                </label>
                <select 
                  value={selectedFont} 
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs p-2.5 rounded-lg text-slate-200 outline-none focus:border-pink-500"
                >
                  {FONTS_LIST.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-neutral-400">Text Solid Color</label>
                <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 p-1.5 rounded-lg">
                  <input 
                    type="color" value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono uppercase text-neutral-300">{textColor}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={addTextElement}
              className="w-full bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 border border-pink-500/20 p-4 rounded-xl flex flex-col items-center gap-2 hover:border-pink-500/40 transition-all text-neutral-300 hover:text-white"
            >
              <Type className="w-5 h-5 text-pink-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Inject Typography Layer</span>
            </button>
          </div>
        )}

        {/* TAB 3: REAL-TIME LAYERS PANEL */}
        {activeTab === "layers" && (
          <div className="space-y-4 animate-fadeIn flex-1 flex flex-col h-full">
            <div>
              <h3 className="text-xs font-black tracking-widest uppercase text-pink-500 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Vector Layer Stack
              </h3>
              <p className="text-[10px] text-neutral-500">Live Stacking Layout Hierarchy</p>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 flex-1">
              {canvasObjects.length === 0 ? (
                <div className="text-center py-8 text-xs text-neutral-600 border border-dashed border-neutral-900 rounded-xl">
                  No active canvas assets found.
                </div>
              ) : (
                canvasObjects.map((obj, idx) => {
                  let layerName = "Asset Layer";
                  if (obj === bgImgRef.current) layerName = "🖼️ Background Photo";
                  else if (obj === fgImgRef.current) layerName = "🖼️ Foreground Subject (Hidden)";
                  else if (obj === maskControlRef.current) layerName = "🎯 Focus Mask Controller";
                  else if (obj.type === "i-text") layerName = `🔤 Text (${(obj as any).text?.substring(0, 8)}...)`;

                  return (
                    <div 
                      key={idx}
                      onClick={() => selectObjectFromLayer(obj)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        obj.canvas?.getActiveObject() === obj 
                          ? "bg-pink-500/10 border-pink-500/30 text-white" 
                          : "bg-neutral-900/60 border-neutral-800/40 text-neutral-400 hover:bg-neutral-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-[10px] text-neutral-600 font-bold">#{idx + 1}</span>
                        <span className="capitalize font-bold text-[11px] text-neutral-200">{layerName}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </aside>
    </div>
  );
};

export default Editor;