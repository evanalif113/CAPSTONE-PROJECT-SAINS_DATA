"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-y-6 sm:flex-row">
          {/* Copyright */}
          <div className="text-center sm:text-left">
            <p className="text-sm text-slate-400">
              &copy; {currentYear} Kumbung Sense. All Rights Reserved.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Empowering Mushroom Farmers with IoT.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-x-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors hover:text-white"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors hover:text-white"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links & Logo */}
        <div className="mt-8 flex flex-col items-center justify-between border-t border-slate-700 pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <img
              src="/img/icon.png"
              alt="Kumbung Sense Logo"
              className="h-6 w-6 rounded-full"
            />
            <span className="font-semibold">Kumbung Sense</span>
          </div>
          <div className="mt-4 flex gap-x-6 text-sm sm:mt-0">
            <Link
              href="/about"
              className="text-slate-400 transition-colors hover:text-white"
            >
              About
            </Link>
            <Link
              href="/privacy-policy"
              className="text-slate-400 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-slate-400 transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;