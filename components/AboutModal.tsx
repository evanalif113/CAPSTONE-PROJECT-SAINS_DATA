"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, X, Linkedin } from "lucide-react";

interface Developer {
  id: number;
  name: string;
  role: string;
  github: string;
  avatarUrl: string;
  linkedin: string;
}

interface AboutModalProps {
  developer: Developer | null;
  onClose: () => void;
}

export default function AboutModal({ developer, onClose }: AboutModalProps) {
  if (!developer) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 p-6 relative transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <Image
            src={developer.avatarUrl}
            alt={`Avatar of ${developer.name}`}
            width={120}
            height={120}
            className="rounded-full mb-4 border-4 border-gray-200 dark:border-gray-600"
          />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {developer.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">
            {developer.role}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Link
              href={`https://github.com/${developer.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-gray-700 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Github size={16} />
              GitHub
            </Link>
            <Link
              href={`https://linkedin.com/in/${developer.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Linkedin size={16} />
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
