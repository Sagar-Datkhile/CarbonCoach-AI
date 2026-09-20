"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { X, MessageSquare, Star, CheckCircle2 } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export function FeedbackModal({ isOpen, onClose, userEmail }: FeedbackModalProps) {
  const [category, setCategory] = useState<"General" | "Bug" | "Feature" | "Accuracy">("General");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate short submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setComments("");
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-dialog-title"
    >
      <div className="absolute inset-0" onClick={() => !isSubmitting && onClose()} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E3E7E3] p-6 z-10 space-y-5 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-[#F3F8F3] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#EAF5EE] text-[#075E45] flex items-center justify-center mx-auto border border-[#0B7252]/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">Thank You for Your Feedback!</h2>
            <p className="text-sm text-[#667085] max-w-xs mx-auto">
              Your insights directly help us improve CarbonCoach AI for households worldwide.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#075E45] flex items-center justify-center shrink-0 border border-[#0B7252]/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 id="feedback-dialog-title" className="text-lg font-bold text-[#111827]">
                  Share Your Feedback
                </h2>
                <p className="text-xs text-[#667085]">
                  Help us refine energy models, recommendations, and household tools
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["General", "Bug", "Feature", "Accuracy"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        category === cat
                          ? "bg-[#075E45] text-white border-[#075E45] shadow-xs"
                          : "bg-white text-[#667085] border-[#E3E7E3] hover:bg-[#F3F8F3]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-1.5">
                  Experience Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating ?? rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                        aria-label={`${star} star`}
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            active
                              ? "text-[#FDB022] fill-[#FDB022]"
                              : "text-[#D0D5DD]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label htmlFor="feedback-text" className="text-xs font-semibold text-[#111827] block mb-1.5">
                  Comments or Suggestions
                </label>
                <textarea
                  id="feedback-text"
                  rows={4}
                  required
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Tell us what you love or how we can make energy management easier for your home..."
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#E3E7E3] text-[#111827] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0B7252] focus:ring-2 focus:ring-[#0B7252]/20 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-xl px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="rounded-xl px-5 bg-[#075E45] hover:bg-[#064e3b]"
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
