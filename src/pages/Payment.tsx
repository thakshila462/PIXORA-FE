import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

const Payment = () => {
  const navigate = useNavigate();

  // States
  const [booking, setBooking] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessNotice, setShowSuccessNotice] = useState(true);
  
  // Card Inputs State
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [bankProof, setBankProof] = useState<string | null>(null);

  // 1. LocalStorage එකෙන් කලින් දාපු බුකින් ඩේටา ලෝඩ් කිරීම
  useEffect(() => {
    const data = localStorage.getItem("currentBooking");
    if (!data) {
      alert("No booking data found! Redirecting to booking page...");
      navigate("/booking");
      return;
    }
    
    const parsedData = JSON.parse(data);
    // සෙක්‍රට් කෝඩ් එකක් නැත්නම් එකක් හදනවා
    if (!parsedData.secretCode) {
      parsedData.secretCode = "SEC-" + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem("currentBooking", JSON.stringify(parsedData));
    }
    setBooking(parsedData);

    // Try to refresh booking from backend (if server has a canonical record)
    (async () => {
      try {
        if (parsedData.serviceId) {
          const resp = await api.get("/service-request", { params: { serviceId: parsedData.serviceId } });
          const latest = resp.data?.data || resp.data;
          if (latest) {
            const merged = { ...parsedData, ...latest };
            localStorage.setItem("currentBooking", JSON.stringify(merged));
            setBooking(merged);
          }
        }
      } catch (err) {
        // If backend doesn't provide the endpoint, silently continue with local data
        console.warn("Could not refresh booking from server:", err);
      }
    })();
  }, [navigate]);

  // 2. වීඩියෝ කාඩ් එකේ බැක්ග්‍රවුන්ඩ් එක මෙතනින් මාරු කරනවා
  const getCardBg = () => {
    if (selectedMethod === "card") return "from-blue-900 to-blue-600 shadow-blue-500/10";
    if (selectedMethod === "mobile") return "from-emerald-900 to-emerald-500 shadow-emerald-500/10";
    if (selectedMethod === "bank") return "from-neutral-800 to-neutral-950 shadow-neutral-500/5";
    return "from-pink-600 to-fuchsia-700 shadow-pink-500/10"; // Default Pixora Theme
  };

  // 3. බැංකු රිසිට් පත් අප්ලෝඩ් කිරීම (Base64 conversion)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBankProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. පේමන්ට් එක සබ්මිට් කිරීම
  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Please select a payment method!");
      return;
    }

    if (selectedMethod === "card" && (!cardNumber || !cardExpiry || !cardCVV)) {
      alert("Please fill all card details!");
      return;
    }

    setLoading(true);

    // Backend එකට ඩේටා සින්ක් කරන කොටස
    setTimeout(async () => {
      const updatedBooking = {
        ...booking,
        status: "PAID",
        paymentMethod: selectedMethod,
        paidAt: new Date().toISOString()
      };

      try {
        await api.put("/service-request/payment-sync", {
          serviceId: booking.serviceId,
          paymentMethod: selectedMethod,
          bankProofBase64: selectedMethod === "bank" ? bankProof : null
        });
      } catch (err) {
        console.error("Sync Error:", err);
        alert("Warning: Payment recorded locally but failed to sync with server.");
      }

      // LocalStorage අප්ඩේට් කිරීම
      localStorage.setItem("currentBooking", JSON.stringify(updatedBooking));
      
      setLoading(false);
      alert("🎉 Payment Successful! Pixora Studio will contact you soon.");
      navigate("/"); // Home එකට හෝ කැමති තැනකට යවන්න
    }, 2500);
  };

  if (!booking) return <div className="text-center text-neutral-500 mt-20 animate-pulse">Loading booking details...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased selection:bg-pink-500 selection:text-white relative overflow-x-hidden py-8 px-4">
      {/* Background Neon Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-fuchsia-950/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[460px] mx-auto">
        {/* Success Notice Banner */}
        {showSuccessNotice && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 animate-fadeIn">
            <div className="text-xl">✅</div>
            <div>
              <p className="text-sm font-bold text-emerald-400">Booking Confirmed!</p>
              <p className="text-xs text-emerald-300 mt-0.5">Service ID: <span className="font-mono font-bold">{booking?.serviceId}</span></p>
            </div>
            <button 
              onClick={() => setShowSuccessNotice(false)}
              className="ml-auto text-emerald-400 hover:text-emerald-300 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="text-neutral-400 hover:text-white text-sm mb-6 transition-colors flex items-center gap-1">
          ← Back
        </button>

        <h4 className="text-2xl font-black tracking-tight mb-6">Secure Checkout</h4>

        {/* 💳 Visual Animated Credit Card (මෙම කොටස කිසිසේත්ම වෙනස් කර නැත) */}
        <div className={`relative bg-gradient-to-br ${getCardBg()} rounded-[24px] p-6 shadow-2xl transition-all duration-500 aspect-[1.58/1] flex flex-col justify-between mb-6 overflow-hidden border border-white/5`}>
          <div className="absolute -inset-y-1/2 -inset-x-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)] pointer-events-none"></div>
          
          <div>
            <div className="text-xs text-white/70 font-light tracking-wide uppercase">Amount Payable</div>
            <div className="text-3xl font-black tracking-wide mt-1">
              Rs {booking.totalCost?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="text-lg tracking-[4px] font-mono my-2 text-white/90">
            {selectedMethod === "card" && cardNumber ? cardNumber : "4242 5678 9012 3456"}
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[8px] uppercase text-white/40 tracking-widest">Client Account</div>
              <div className="text-xs font-semibold tracking-wide">PIXORA CUSTOMER</div>
            </div>
            <div className="text-xl font-black italic tracking-tighter text-white/90">VISA</div>
          </div>
        </div>

        {/* 📝 Glassmorphism Order Details Panel */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[24px] p-5 mb-5 shadow-xl">
          <h6 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">📋 Booking Summary</h6>
          <div className="space-y-2 text-xs">
            {booking?.serviceId && (
              <p className="text-neutral-300">
                <b className="font-semibold text-neutral-400">Service ID:</b> 
                <span className="ml-2 font-mono text-blue-400">{booking.serviceId}</span>
              </p>
            )}
            {booking?.name && (
              <p className="text-neutral-300">
                <b className="font-semibold text-neutral-400">Client Name:</b> {booking.name}
              </p>
            )}
            {booking?.email && (
              <p className="text-neutral-300">
                <b className="font-semibold text-neutral-400">Email:</b> {booking.email}
              </p>
            )}
            {booking?.packageId && (
              <p className="text-neutral-300">
                <b className="font-semibold text-neutral-400">Package:</b> 
                {typeof booking.packageId === "object" ? booking.packageId?.title || "Custom" : booking.packageId}
              </p>
            )}
            {booking?.duration && (
              <p className="text-neutral-300">
                <b className="font-semibold text-neutral-400">Duration:</b> {booking.duration} day(s)
              </p>
            )}
            {booking?.serviceType && (
              <p className="text-neutral-300">
                <b className="font-semibold text-neutral-400">Service Type:</b> {booking.serviceType}
              </p>
            )}
            {booking?.note && (
              <p className="text-neutral-300">
                <b className="font-semibold text-neutral-400">Special Notes:</b>
                <span className="block text-neutral-400 italic mt-1">"{booking.note}"</span>
              </p>
            )}
            {booking?.rating && (
              <p className="text-neutral-300">
                <b className="font-semibold text-neutral-400">Your Rating:</b> ⭐ {booking.rating}/5
              </p>
            )}
          </div>
        </div>

        {/* 🛠️ Payment Methods Selection */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[24px] p-5 mb-5 shadow-xl space-y-3">
          <h6 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Select Payment Method</h6>

          {/* Option 1: Card */}
          <div 
            onClick={() => setSelectedMethod("card")}
            className={`flex items-center gap-4 p-4 rounded-[16px] border cursor-pointer transition-all duration-300 ${selectedMethod === "card" ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/5" : "border-white/5 bg-white/[0.01] hover:bg-white/[0.05]"}`}
          >
            <div className="text-2xl">💳</div>
            <div>
              <div className="text-sm font-bold">Card Payment</div>
              <div className="text-xs text-neutral-400 font-light">Debit / Credit Card</div>
            </div>
          </div>

          {/* Dynamic Card Sub-inputs */}
          {selectedMethod === "card" && (
            <div className="p-1 space-y-2 animate-fadeIn">
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white placeholder-neutral-600"
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  maxLength={5}
                  className="w-1/2 px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white placeholder-neutral-600"
                />
                <input 
                  type="password" 
                  placeholder="CVV" 
                  value={cardCVV}
                  onChange={(e) => setCardCVV(e.target.value)}
                  maxLength={3}
                  className="w-1/2 px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white placeholder-neutral-600"
                />
              </div>
            </div>
          )}

          {/* Option 2: Mobile QR */}
          <div 
            onClick={() => setSelectedMethod("mobile")}
            className={`flex items-center gap-4 p-4 rounded-[16px] border cursor-pointer transition-all duration-300 ${selectedMethod === "mobile" ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/5" : "border-white/5 bg-white/[0.01] hover:bg-white/[0.05]"}`}
          >
            <div className="text-2xl">📱</div>
            <div>
              <div className="text-sm font-bold">Mobile Payment</div>
              <div className="text-xs text-neutral-400 font-light">Scan instantly via QR Code</div>
            </div>
          </div>

          {/* Dynamic QR Output */}
          {selectedMethod === "mobile" && (
            <div className="flex justify-center p-3 bg-white/5 rounded-2xl animate-fadeIn">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&color=ffffff&bgcolor=0f172a&data=pixorastudio-payment" 
                alt="QR Code" 
                className="rounded-xl border border-white/10"
              />
            </div>
          )}

          {/* Option 3: Bank Transfer */}
          <div 
            onClick={() => setSelectedMethod("bank")}
            className={`flex items-center gap-4 p-4 rounded-[16px] border cursor-pointer transition-all duration-300 ${selectedMethod === "bank" ? "border-neutral-400 bg-white/5" : "border-white/5 bg-white/[0.01] hover:bg-white/[0.05]"}`}
          >
            <div className="text-2xl">🏦</div>
            <div>
              <div className="text-sm font-bold">Bank Transfer</div>
              <div className="text-xs text-neutral-400 font-light">Manual verification via receipt</div>
            </div>
          </div>

          {/* Dynamic File Upload Sub-input */}
          {selectedMethod === "bank" && (
            <div className="p-1 space-y-1 animate-fadeIn text-xs text-neutral-400">
              <label className="block mb-1">Upload proof of transfer slip:</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl focus:outline-none focus:border-white text-neutral-300 text-xs"
              />
            </div>
          )}
        </div>

        {/* 🧾 Bottom Pricing Bar */}
        <div className="flex justify-between items-center mb-5 px-2">
          <span className="text-sm text-neutral-400">Total Payable</span>
          <h3 className="text-2xl font-black text-white">
            Rs {booking.totalCost?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </h3>
        </div>

        {/* 🚀 Main Action Button */}
        <button 
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 bg-white text-neutral-950 hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 shadow-xl shadow-white/5"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
              Processing Payment...
            </>
          ) : (
            <>Pay Now →</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;