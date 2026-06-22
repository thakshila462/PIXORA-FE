import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  Clock, 
  MapPin, 
  Sliders, 
  Sparkles, 
  Bot, 
  LogOut, 
  ArrowRightCircle, 
  CheckCircle,
  HelpCircle,
  Image,
  Layers,
  Grid,
  X,
  Star,
  Search,
  Lock, 
  ArrowRight
} from "lucide-react";

interface PhotoPackage {
  id: string;
  name: string;
  price: number;
  category?: string;
  durationText?: string;
  photosCount?: string;
  features?: string[];
  isPopular?: boolean;
}

const Booking = () => {
  const navigate = useNavigate();

  // AUTHENTICATION STATE CHECK
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [packages, setPackages] = useState<PhotoPackage[]>([]);
  const [selectedPkg, setSelectedPkg] = useState("");
  const [duration, setDuration] = useState(1);
  const [delivery, setDelivery] = useState("no");
  const [serviceType, setServiceType] = useState("standard");
  const [note, setNote] = useState("");

  // INTERACTIVE STAR RATING STATES
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // MODAL & SEARCH CONTROLLER STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedPkg, setTempSelectedPkg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [aiMessage, setAiMessage] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const studioLocation = { lat: 7.2906, lng: 80.6337 };
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [distanceText, setDistanceText] = useState("");

  // INITIAL AUTHENTICATION & SECURITY GATE CHECK
  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    
    if (!token) {
      setIsAuthenticated(false);
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // LOAD PACKAGES FROM BACKEND
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadPackages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/packages");
        const data = await res.json();

        setPackages(
          data.data.map((pkg: any) => ({
            id: pkg._id,
            name: pkg.title,
            price: Number(pkg.price),
            category: pkg.category || "studio",
            durationText: pkg.duration ? `${pkg.duration} Hours/Days` : "Standard Session",
            photosCount: pkg.photosCount ? `${pkg.photosCount} Photos` : "Unlimited Shots",
            features: pkg.features || [],
            isPopular: Boolean(pkg.isPopular)
          }))
        );
      } catch (error) {
        console.error("Package load error:", error);
      }
    };

    loadPackages();
  }, [isAuthenticated]);

  // OPEN MODAL UTILITY
  const openPackageModal = () => {
    setTempSelectedPkg(selectedPkg);
    setSearchQuery("");
    setIsModalOpen(true);
  };

  // CONFIRM MODAL SELECTION
  const confirmPackageSelection = () => {
    setSelectedPkg(tempSelectedPkg);
    setRating(0);
    setIsModalOpen(false);
  };

  // AI CHAT CORE ENGINE
  const askAI = async () => {
    if (!aiMessage.trim() || aiLoading) return;
    setAiLoading(true);
    setAiReply("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: aiMessage }),
      });
      const data = await res.json();
      if (!data?.success && !data?.reply) {
        setAiReply("⚠️ Server error. Please try again.");
        return;
      }
      setAiReply(data.reply);
    } catch (error) {
      setAiReply("❌ Network error or backend not running.");
    } finally {
      setAiLoading(false);
    }
  };

  // DISTANCE HAIVERSINE FORMULA
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const getMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
      setUserLocation(loc);
      const distance = calculateDistance(studioLocation.lat, studioLocation.lng, loc.lat, loc.lng);
      const cost = Math.round(distance * 60);
      setDeliveryCost(cost);
      setDistanceText(`📍 ${distance.toFixed(2)} km (Rs ${cost.toLocaleString()})`);
    });
  };

  // TOTAL BILLING SYSTEM CALC
  const calcTotal = () => {
    const pkg = packages.find((p) => p.id === selectedPkg);
    if (!pkg) return "0.00";
    let total = pkg.price * duration;
    if (serviceType === "premium") total *= 1.15;
    if (delivery === "yes") total += deliveryCost;
    return total.toLocaleString("en-US", { minimumFractionDigits: 2 });
  };

  // SECURE BOOKING ACTION DISPATCH (WITH ERROR DIAGNOSTICS)
  const submitBookingRequest = async () => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      alert("Authentication session lost. Please log in again.");
      navigate("/login");
      return;
    }

    const pkg = packages.find((p) => p.id === selectedPkg);
    if (!pkg) return alert("Please click 'Choose Package' and select a tier first!");

    const generatedServiceId = "PIX-" + Date.now();

    // ⚡ LocalStorage එකෙන් නම සහ ඊමේල් එක ලබාගැනීම
    const storedName = localStorage.getItem("USER_NAME") || "Verified Client";
    const storedEmail = localStorage.getItem("USER_EMAIL") || "client@pixora.com";

    // Base Payload Setup
    const payload: any = {
      serviceId: generatedServiceId,
      name: storedName,      // ⚡ මෙන්න මෙතනින් නම යනවා
      email: storedEmail,    // ⚡ මෙන්න මෙතනින් ඊමේල් එක යනවා
      packageId: selectedPkg,
      duration,
      serviceType,
      totalCost: parseFloat(calcTotal().replace(/,/g, "")),
      note,
      userLat: userLocation?.lat || 0,
      userLng: userLocation?.lng || 0,
      studioLat: studioLocation.lat,
      studioLng: studioLocation.lng,
      status: "pending",     // Schema enum එක සිම්පල් නිසා "pending" ලෙස දැමීම
      createdAt: new Date().toISOString(),
    };

    // 0 වුනොත් Backend Schema එක රණ්ඩු වෙන නිසා, තරුවක් ක්ලික් කරලා තිබ්බොත් විතරක් rating යවනවා
    if (rating > 0) {
      payload.rating = rating;
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/service-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      // ⚡ BACKEND ERROR DIAGNOSTIC GATEWAY (400 BAD REQUEST අල්ලන තැන)
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend Validation Error Details:", errorData);
        
        // Backend එකෙන් එවපු නිවැරදිම ලෙඩේ Alert එකක් විදිහට පෙන්වනවා
        alert(`Booking Failed (400): ${errorData.message || errorData.error || JSON.stringify(errorData)}`);
        return;
      }

      // Try to read server response and persist booking data for the Payment page
      let respData: any = {};
      try {
        respData = await res.json();
      } catch (e) {
        // ignore parse errors, we'll fallback to payload
      }

      const serverBooking = respData?.data || respData || {};
      const bookingToStore = {
        ...payload,
        ...serverBooking,
      };

      // Ensure serviceId and totalCost exist for Payment page
      if (!bookingToStore.serviceId) bookingToStore.serviceId = generatedServiceId;
      if (!bookingToStore.totalCost) bookingToStore.totalCost = payload.totalCost;

      localStorage.setItem("currentBooking", JSON.stringify(bookingToStore));

      // Navigate directly to payment without alert (smoother UX)
      navigate("/payment", { replace: true });

    } catch (err) {
      console.error("Network Error:", err);
      alert("Network error or server is offline.");
    }
  };

  const logoutUser = () => {
    localStorage.clear();
    navigate("/login");
  };

  const currentSelectedPkgObject = packages.find(p => p.id === selectedPkg);

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. SESSION VERIFICATION LOADER
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#030508] flex flex-col items-center justify-center text-slate-400 font-sans">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-widest font-bold">Verifying Security Session...</p>
      </div>
    );
  }

  // 2. CYBERPUNK AUTHENTICATION REQUIRED WARNING SCREEN
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#030508] text-slate-100 font-sans flex items-center justify-center relative overflow-hidden px-6">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[140px] pointer-events-none"></div>
        
        <div className="max-w-md w-full bg-neutral-950 border border-neutral-900 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative z-10">
          <div className="w-16 h-16 mx-auto bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center">
            <Lock className="w-7 h-7 text-pink-500 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-tight text-white uppercase">Authentication Required</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              You must be securely authenticated to access the PIXORA Capture Portal. You are being automatically redirected shortly.
            </p>
          </div>

          <div className="p-3 bg-neutral-900/40 border border-neutral-900 rounded-xl">
            <span className="text-[10px] font-mono text-pink-400 uppercase font-black tracking-widest animate-pulse">
              Redirecting to Gateway in 3s...
            </span>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:opacity-95 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2 group"
          >
            Proceed to Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // 3. SECURE AUTHENTICATED WORKSPACE
  return (
    <div className="min-h-screen bg-[#030508] text-slate-100 font-sans pb-20 selection:bg-pink-500 selection:text-white relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[250px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-[130px] pointer-events-none"></div>

      {/* PORTAL HEADER */}
      <header className="relative flex flex-col sm:flex-row justify-between items-center py-8 px-6 md:px-12 border-b border-neutral-900/60 bg-neutral-950/20 z-10 gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> PIXORA Capture Portal
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
            Secure Studio Reservation
          </h1>
        </div>
        <button 
          onClick={logoutUser}
          className="px-4 py-2 bg-neutral-900/50 hover:bg-red-950/30 border border-neutral-900 hover:border-red-900/50 text-neutral-400 hover:text-red-400 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </header>

      {/* CORE CONTROL HUBS */}
      <main className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        
        <section className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: CATALOGUE SELECTION */}
          <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-pink-500" />
                <h2 className="text-sm font-black uppercase tracking-widest text-white">
                  1. Studio Photography Tier
                </h2>
              </div>
              
              <button
                type="button"
                onClick={openPackageModal}
                className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-fuchsia-600/20 hover:from-pink-500 hover:to-fuchsia-600 border border-pink-500/40 hover:border-transparent text-pink-400 hover:text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md flex items-center gap-2"
              >
                <Grid className="w-3.5 h-3.5" /> Choose Package ({packages.length} Available)
              </button>
            </div>

            {currentSelectedPkgObject ? (
              <div className="border border-pink-500/30 bg-pink-500/[0.02] rounded-2xl p-5 relative overflow-hidden animate-fadeIn space-y-4">
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-[9px] uppercase tracking-widest rounded-md">
                  {currentSelectedPkgObject.category}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest block mb-0.5">Active Selection</span>
                    <h3 className="font-black text-xl text-white tracking-tight">{currentSelectedPkgObject.name}</h3>
                    <p className="text-lg font-black text-slate-300 mt-0.5">Rs. {currentSelectedPkgObject.price.toLocaleString()}</p>
                  </div>

                  <div className="flex gap-4 text-[11px] text-neutral-400 border-t border-b border-neutral-900/60 py-2">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-neutral-500" /> {currentSelectedPkgObject.durationText}</span>
                    <span className="flex items-center gap-1"><Image className="w-3.5 h-3.5 text-neutral-500" /> {currentSelectedPkgObject.photosCount}</span>
                  </div>

                  {currentSelectedPkgObject.features && currentSelectedPkgObject.features.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                      {currentSelectedPkgObject.features.map((f, i) => (
                        <span key={i} className="text-[11px] text-neutral-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-pink-500" /> {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* STAR RATING CONTROLS */}
                <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Rate this package tier</span>
                    <p className="text-[11px] text-neutral-500">How would you grade this package setup?</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = star <= (hoverRating || rating);
                      return (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-all duration-150 transform hover:scale-125 focus:outline-none"
                        >
                          <Star 
                            className={`w-5 h-5 transition-all ${
                              isActive 
                                ? "text-pink-500 fill-pink-500 drop-shadow-[0_0_6px_rgba(236,72,153,0.6)]" 
                                : "text-neutral-700 hover:text-neutral-500"
                            }`} 
                          />
                        </button>
                      );
                    })}
                    {rating > 0 && (
                      <span className="text-[10px] font-mono font-bold text-pink-400 ml-2 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded">
                        {rating}.0 / 5
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="border-2 border-dashed border-neutral-900 rounded-2xl p-8 text-center bg-neutral-950/40">
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-3">No photography package linked yet</p>
                <button 
                  onClick={openPackageModal}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[11px] text-neutral-300 font-bold uppercase rounded-lg border border-neutral-800 transition-all"
                >
                  Browse Catalog
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: TIMELINE */}
          <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
              <Layers className="w-4 h-4 text-pink-500" />
              <h2 className="text-sm font-black uppercase tracking-widest text-white">2. Set Timeline Duration</h2>
            </div>
            <div className="space-y-1.5 max-w-xs">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Event Multiplier (Days/Shifts)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 w-4 h-4 text-neutral-600" />
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
                  min="1"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-pink-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* STEP 3: TRAVELLING */}
          <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
              <MapPin className="w-4 h-4 text-pink-500" />
              <h2 className="text-sm font-black uppercase tracking-widest text-white">3. Outstation Travelling</h2>
            </div>

            <div className="space-y-4">
              <p className="text-neutral-500 text-xs">Does your photoshoot location extend outside our core base?</p>
              <div className="flex gap-6 py-1">
                <label className="flex items-center gap-2.5 text-xs font-bold text-neutral-300 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="delivery"
                    value="yes"
                    checked={delivery === "yes"}
                    onChange={() => setDelivery("yes")}
                    className="w-4 h-4 accent-pink-500 cursor-pointer"
                  />
                  Yes, Require Outstation Travel
                </label>
                <label className="flex items-center gap-2.5 text-xs font-bold text-neutral-300 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="delivery"
                    value="no"
                    checked={delivery === "no"}
                    onChange={() => {
                      setDelivery("no");
                      setDistanceText("");
                      setDeliveryCost(0);
                    }}
                    className="w-4 h-4 accent-pink-500 cursor-pointer"
                  />
                  No, In-Studio Session
                </label>
              </div>

              {delivery === "yes" && (
                <div className="pt-2 space-y-3">
                  <button
                    onClick={getMyLocation}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-pink-500" /> Compute Coordinates & Pin Location
                  </button>
                  {distanceText && (
                    <div className="p-3 bg-neutral-900/40 border border-neutral-800 rounded-xl text-center">
                      <span className="text-xs font-mono font-bold text-pink-400">{distanceText}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* STEP 4: RETOUCH MODES */}
          <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
              <Sliders className="w-4 h-4 text-pink-500" />
              <h2 className="text-sm font-black uppercase tracking-widest text-white">4. Service Mode Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-6 py-1">
                <label className="flex items-center gap-2.5 text-xs font-bold text-neutral-300 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="serviceType"
                    value="standard"
                    checked={serviceType === "standard"}
                    onChange={() => setServiceType("standard")}
                    className="w-4 h-4 accent-pink-500 cursor-pointer"
                  />
                  Standard Delivery
                </label>
                <label className="flex items-center gap-2.5 text-xs font-bold text-neutral-300 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="serviceType"
                    value="premium"
                    checked={serviceType === "premium"}
                    onChange={() => setServiceType("premium")}
                    className="w-4 h-4 accent-pink-500 cursor-pointer"
                  />
                  Premium Executive Mode (+15%)
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Custom Retouching & Shoot Instructions</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Specify backdrop colors, specific frames, or mandatory lighting instructions..."
                  rows={3}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-pink-500/50 transition-all resize-none"
                />
              </div>
            </div>
          </div>

        </section>

        {/* FINANCIAL SUMMARY & COGNITIVE ENGINE */}
        <section className="lg:col-span-1 space-y-6">
          <div className="sticky top-6 space-y-6">
            
            {/* INVOICE CARD */}
            <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-900 p-6 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
              <div className="border-b border-neutral-800/60 pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Statement Valuation</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">Calculated parameters based on real-time selections.</p>
              </div>

              <div className="space-y-3">
                {selectedPkg ? (
                  <>
                    <div className="flex justify-between items-center text-xs text-neutral-400">
                      <span>Selected Tier Base</span>
                      <span className="font-mono text-white">
                        Rs. {(packages.find(p => p.id === selectedPkg)?.price || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-neutral-400">
                      <span>Timeline Multiplier</span>
                      <span className="text-white font-medium">x {duration}</span>
                    </div>
                    {serviceType === "premium" && (
                      <div className="flex justify-between items-center text-xs text-pink-400">
                        <span>Premium Fee Mode</span>
                        <span className="font-mono">+15%</span>
                      </div>
                    )}
                    {delivery === "yes" && deliveryCost > 0 && (
                      <div className="flex justify-between items-center text-xs text-cyan-400">
                        <span>Travelling Cost</span>
                        <span className="font-mono">Rs. {deliveryCost.toLocaleString()}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-neutral-600 text-xs italic py-2 flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5" /> Link package to compute financials...
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex flex-col items-center justify-center py-4 bg-neutral-900/30 rounded-2xl border border-neutral-900">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total Valuation</span>
                <span className="text-3xl font-black text-transparent bg-gradient-to-r from-white via-slate-200 to-neutral-400 bg-clip-text mt-1">
                  Rs. {calcTotal()}
                </span>
              </div>

              <button
                onClick={submitBookingRequest}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:opacity-95 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2"
              >
                Dispatch Booking Request <ArrowRightCircle className="w-4 h-4" />
              </button>
            </div>

            {/* AI HUB */}
            <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
                <Bot className="w-4 h-4 text-pink-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Pixora AI Consultant</h3>
              </div>

              <div className="space-y-3">
                <textarea
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Ask AI for design ideas, strategy suggestion..."
                  rows={2}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-600 outline-none focus:border-pink-500/50 transition-all resize-none"
                />
                <button
                  disabled={aiLoading}
                  onClick={askAI}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-bold uppercase rounded-lg transition-all"
                >
                  {aiLoading ? "Consulting..." : "Consult AI Engine"}
                </button>

                {aiReply && (
                  <div className="p-3 bg-neutral-900/30 border border-neutral-900 rounded-xl text-[11px] text-neutral-400 leading-relaxed max-h-36 overflow-y-auto">
                    {aiReply}
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* CATALOG SEARCH OVERLAY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#06080c] border border-neutral-900 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-pink-500/5">
            
            <div className="p-6 border-b border-neutral-900 bg-neutral-950/40 rounded-t-3xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                    <Grid className="w-4 h-4 text-pink-500" /> PIXORA Photography Catalogue
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Explore and choose your preferred tier from the studio network.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* LIVE SEARCH BAR */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
                <input
                  type="text"
                  placeholder="Filter by title or studio category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-pink-500/40 transition-all"
                />
              </div>
            </div>

            {/* PACKAGE SELECTION LIST GRID */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    onClick={() => setTempSelectedPkg(pkg.id)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      tempSelectedPkg === pkg.id 
                        ? "border-pink-500 bg-pink-500/[0.03] shadow-lg shadow-pink-500/5" 
                        : "border-neutral-900 bg-neutral-950/40 hover:bg-neutral-900/30 hover:border-neutral-800"
                    }`}
                  >
                    {pkg.isPopular && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-pink-500 text-white font-black text-[8px] uppercase tracking-wider rounded-md">
                        Popular
                      </div>
                    )}

                    <div className="space-y-2">
                      <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest">{pkg.category}</span>
                      <h4 className="font-bold text-sm text-white tracking-tight">{pkg.name}</h4>
                      <p className="text-xs text-pink-400 font-mono font-bold">Rs. {pkg.price.toLocaleString()}</p>
                      
                      <div className="flex gap-3 text-[10px] text-neutral-500 pt-1">
                        <span>⏱️ {pkg.durationText}</span>
                        <span>🖼️ {pkg.photosCount}</span>
                      </div>
                    </div>

                    {pkg.features && pkg.features.length > 0 && (
                      <div className="border-t border-neutral-900/60 mt-3 pt-3 flex flex-wrap gap-x-3 gap-y-1">
                        {pkg.features.slice(0, 3).map((feat, i) => (
                          <span key={i} className="text-[10px] text-neutral-400 flex items-center gap-1">
                            • {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-neutral-600 text-xs italic">
                  No packages match your search criteria.
                </div>
              )}
            </div>

            {/* MODAL BOTTOM CONTROLS */}
            <div className="p-6 border-t border-neutral-900 bg-neutral-950/20 rounded-b-3xl flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-300 text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPackageSelection}
                disabled={!tempSelectedPkg}
                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:opacity-95 disabled:from-neutral-900 disabled:to-neutral-900 border border-transparent disabled:border-neutral-800 text-white disabled:text-neutral-600 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-pink-500/5"
              >
                Link Selected Tier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Booking;