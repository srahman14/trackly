import toast from "react-hot-toast";

import React from "react";
import { Briefcase, CircleX } from "lucide-react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";

export const DeleteToast = (jobTitle: string) => {
  return toast.custom((t) => (
    <AnimatePresence>
      <motion.div
        className={`${
          t.visible ? "animate-custom-enter" : "animate-custom-leave"
        } max-w-md w-full bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="shrink-0 pt-0.5">
              <CircleX className="h-10 w-10 text-red-500 rounded-full" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white dark:text-gray-900">
                Job removed
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Successfully deleted: {jobTitle}.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-500 focus:outline-none cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  ));
};

export const AddOrEditJobToast = (mode: string, jobTitle: string) => {
  return toast.custom((t) => (
    <AnimatePresence>
      <motion.div
        className={`${
          t.visible ? "animate-custom-enter" : "animate-custom-leave"
        } max-w-md w-full bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.45, ease: easeInOut }}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="shrink-0 pt-0.5">
              <Briefcase className="h-10 w-10 text-green-500 rounded-full" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white dark:text-gray-900">
                {mode === "create" ? "Added job" : "Edited job"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Successfully {mode === "create" ? "added" : "edited"}:{" "}
                {jobTitle}.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-500 focus:outline-none cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  ));
};
