"use client";

import { Twitter, ArrowRight, MessageSquare, Heart, Share } from "lucide-react";
import type { Tweet } from "@/lib/content";
import { FrankenContainer } from "./franken-elements";
import { motion } from "framer-motion";

function TweetCard({ tweet, index }: { tweet: Tweet; index: number }) {
  const hasExternalPost = tweet.type === "embed" && typeof tweet.tweetUrl === "string";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 3) * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <FrankenContainer withBolts={false} className="group h-full glass-modern transition-all duration-500 hover:bg-white/[0.03] hover:border-green-500/30 hover:-translate-y-1">
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <Twitter className="h-5 w-5" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-black flex items-center justify-center">
                 <div className="h-1.5 w-1.5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-base font-black text-white group-hover:text-green-400 transition-colors leading-tight">{tweet.author}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{tweet.handle}</p>
            </div>
            <span className="ml-auto text-[10px] font-black text-slate-600 uppercase tracking-widest">{tweet.date}</span>
          </div>

          <p className="text-lg font-medium leading-relaxed text-slate-300 group-hover:text-slate-200 transition-colors italic mb-10 flex-1">
            &ldquo;{tweet.content}&rdquo;
          </p>

          <div className="space-y-6">
            {hasExternalPost && (
              <a
                href={tweet.tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-[10px] font-black uppercase tracking-[0.2em] text-green-400 transition-all hover:bg-green-500 hover:text-black hover:border-green-500"
              >
                <span>Verify Thread</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            )}

            <div className="pt-6 border-t border-white/5 flex items-center gap-6 opacity-30 group-hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black">42</span>
               </div>
               <div className="flex items-center gap-2">
                  <Heart className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black">128</span>
               </div>
               <div className="flex items-center gap-2">
                  <Share className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black">REPOST</span>
               </div>
            </div>
          </div>
        </div>
      </FrankenContainer>
    </motion.div>
  );
}

export default function TweetWall({ tweets, limit }: { tweets: Tweet[]; limit?: number }) {
  const displayTweets = limit ? tweets.slice(0, limit) : tweets;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayTweets.map((tweet, i) => (
        <TweetCard key={`${tweet.date}-${tweet.handle}-${tweet.tweetUrl ?? i}`} tweet={tweet} index={i} />
      ))}
    </div>
  );
}
