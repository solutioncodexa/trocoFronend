import type { ComponentProps } from "react";
import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      expand={false}
      richColors={false}
      closeButton
      duration={3500}
      gap={10}
      visibleToasts={4}
      className="toaster group z-[10000] pointer-events-auto"
      style={{ zIndex: 10000 }}
      toastOptions={{
        classNames: {
          toast:
            "group toast troco-toast !pointer-events-auto !flex !items-center !gap-3 !rounded-xl !border !border-solid !bg-white !text-foreground !shadow-lg !font-body !px-4 !py-3.5 !min-h-0",
          title: "!font-semibold !text-sm !leading-snug !text-foreground !m-0",
          description: "!text-xs !leading-relaxed !text-muted-foreground !mt-0.5 !opacity-100",
          icon: "!m-0 !size-5 !shrink-0 !self-center",
          content: "!m-0 !flex-1 !min-w-0 !gap-0.5",
          closeButton:
            "!static !relative !right-0 !top-0 !left-auto !translate-x-0 !translate-y-0 !ml-1 !size-6 !rounded-lg !border-0 !bg-transparent !text-muted-foreground hover:!bg-muted hover:!text-foreground",
          actionButton:
            "!bg-primary !text-primary-foreground !rounded-lg !text-xs !font-medium !px-3 !py-1.5 hover:!bg-primary/90 !shrink-0",
          cancelButton:
            "!bg-secondary !text-secondary-foreground !rounded-lg !text-xs !font-medium !shrink-0",
          success: "!border-emerald-200 !bg-white",
          error: "!border-red-200 !bg-white",
          warning: "!border-amber-200 !bg-white",
          info: "!border-border !bg-white",
          loading: "!border-border !bg-white",
        },
      }}
      icons={{
        success: <CheckCircle2 className="size-[18px] shrink-0 text-emerald-600" strokeWidth={2.25} />,
        error: <XCircle className="size-[18px] shrink-0 text-red-600" strokeWidth={2.25} />,
        warning: <AlertTriangle className="size-[18px] shrink-0 text-amber-600" strokeWidth={2.25} />,
        info: <Info className="size-[18px] shrink-0 text-primary" strokeWidth={2.25} />,
        loading: <Loader2 className="size-[18px] shrink-0 animate-spin text-primary" strokeWidth={2.25} />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
