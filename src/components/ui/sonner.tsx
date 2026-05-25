import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      expand={false}
      richColors={false}
      closeButton={false}
      duration={3500}
      gap={8}
      className="toaster group z-[10000] pointer-events-auto"
      style={{ zIndex: 10000 }}
      toastOptions={{
        classNames: {
          toast:
            "group toast !bg-[hsl(40,30%,97%)] !text-[hsl(30,10%,10%)] !border !border-[hsl(43,70%,47%,0.3)] !shadow-[0_8px_32px_-4px_hsl(43,70%,47%,0.18),0_2px_8px_-2px_hsl(30,10%,10%,0.08)] !rounded-lg !font-[Montserrat,sans-serif] !py-3 !px-4 !gap-3",
          title: "!font-semibold !text-sm !text-[hsl(30,10%,10%)]",
          description: "!text-xs !text-[hsl(30,8%,45%)] !mt-0.5",
          actionButton:
            "!bg-[hsl(43,70%,47%)] !text-white !rounded-md !text-xs !font-medium !px-3 !py-1.5 hover:!bg-[hsl(43,75%,40%)]",
          cancelButton:
            "!bg-[hsl(40,25%,94%)] !text-[hsl(30,10%,15%)] !rounded-md !text-xs !font-medium",
          success:
            "!border-[hsl(43,70%,47%,0.4)] !bg-[hsl(43,60%,96%)]",
          error:
            "!border-[hsl(0,50%,70%,0.4)] !bg-[hsl(0,40%,97%)]",
          warning:
            "!border-[hsl(35,80%,55%,0.4)] !bg-[hsl(40,60%,96%)]",
          info:
            "!border-[hsl(43,40%,60%,0.3)] !bg-[hsl(40,30%,97%)]",
          loading:
            "!border-[hsl(43,70%,47%,0.3)] !bg-[hsl(40,30%,97%)]",
        },
      }}
      icons={{
        success: <CheckCircle2 className="w-[18px] h-[18px] text-[hsl(43,70%,47%)] shrink-0" />,
        error: <XCircle className="w-[18px] h-[18px] text-[hsl(0,72%,51%)] shrink-0" />,
        warning: <AlertTriangle className="w-[18px] h-[18px] text-[hsl(35,80%,50%)] shrink-0" />,
        info: <Info className="w-[18px] h-[18px] text-[hsl(43,50%,45%)] shrink-0" />,
        loading: <Loader2 className="w-[18px] h-[18px] text-[hsl(43,70%,47%)] shrink-0 animate-spin" />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
