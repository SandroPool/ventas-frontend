import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerFuturisticProps {
    value: string;
    onChange: (date: string) => void;
    label?: string;
}

const weekDays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

const toISODate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const parseISODate = (value: string) => {
    if (!value) return new Date();
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    return new Date(year, month - 1, day);
};

const formatDate = (value: string) => {
    if (!value) return "Seleccionar fecha";
    return new Intl.DateTimeFormat("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(parseISODate(value));
};

const DatePickerFuturistic = ({
    value,
    onChange,
    label = "Fecha",
}: DatePickerFuturisticProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [displayMonth, setDisplayMonth] = useState(() => {
        const referenceDate = parseISODate(value);
        return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    });
    const pickerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 768px)").matches);
    const [fixedPosition, setFixedPosition] = useState<{ left: number; top: number } | null>(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");
        const updateDesktopMode = () => setIsDesktop(mediaQuery.matches);
        mediaQuery.addEventListener("change", updateDesktopMode);
        return () => mediaQuery.removeEventListener("change", updateDesktopMode);
    }, []);

    useEffect(() => {
        if (!isOpen || !isDesktop || !triggerRef.current) return;

        const updatePosition = () => {
            const triggerRect = triggerRef.current?.getBoundingClientRect();
            if (!triggerRect) return;

            const calendarHeight = 336;
            const calendarWidth = 280;
            const preferredTop = triggerRect.top - calendarHeight - 8;
            const top = preferredTop >= 8 ? preferredTop : Math.min(triggerRect.bottom + 8, window.innerHeight - calendarHeight - 8);
            const left = Math.max(8, Math.min(triggerRect.left, window.innerWidth - calendarWidth - 8));
            setFixedPosition({ left, top });
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isOpen, isDesktop]);

    useEffect(() => {
        if (!value) return;
        const referenceDate = parseISODate(value);
        setDisplayMonth(new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1));
    }, [value]);

    useEffect(() => {
        if (!isOpen) return;

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (event.target instanceof Node && !pickerRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [isOpen]);

    const toggleCalendar = () => {
        if (!isOpen) {
            const referenceDate = parseISODate(value);
            setDisplayMonth(new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1));
        }
        setIsOpen((open) => !open);
    };

    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const leadingDays = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarCells: (number | null)[] = [
        ...Array.from({ length: leadingDays }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    return (
        <div ref={pickerRef} className="relative w-full">
            <label className="mb-2 block font-semibold text-gray-900 dark:text-dark-primary">
                {label}
            </label>
            <button
                ref={triggerRef}
                type="button"
                aria-label={`Abrir calendario para ${label.toLowerCase()}`}
                aria-expanded={isOpen}
                onClick={toggleCalendar}
                className="flex w-full items-center gap-3 rounded-lg border border-teal-500 bg-transparent px-4 py-2 text-left text-lg text-gray-900 shadow-md outline-none transition focus:ring-2 focus:ring-teal-500 dark:text-dark-primary"
            >
                <CalendarDays size={20} className="shrink-0 text-teal-500" />
                <span className="min-w-0 flex-1">{formatDate(value)}</span>
                <span className="text-sm text-gray-500 dark:text-dark-muted">▾</span>
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label={`Calendario para ${label.toLowerCase()}`}
                    style={isDesktop && fixedPosition ? ({
                        position: "fixed",
                        left: fixedPosition.left,
                        top: fixedPosition.top,
                        width: 280,
                    } as CSSProperties) : undefined}
                    className="absolute left-0 z-[200] mt-2 w-full min-w-[17rem] rounded-xl border border-teal-100 bg-white p-3 shadow-xl dark:border-dark-border dark:bg-dark-card md:w-[17.5rem] md:min-w-0"
                >
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <button
                            type="button"
                            aria-label="Mes anterior"
                            onClick={() => setDisplayMonth(new Date(year, month - 1, 1))}
                            className="rounded-lg p-2 text-gray-600 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-dark-secondary dark:hover:bg-dark-elevated"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <h2 className="font-semibold capitalize text-gray-900 dark:text-dark-primary">
                            {new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric" }).format(displayMonth)}
                        </h2>
                        <button
                            type="button"
                            aria-label="Mes siguiente"
                            onClick={() => setDisplayMonth(new Date(year, month + 1, 1))}
                            className="rounded-lg p-2 text-gray-600 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-dark-secondary dark:hover:bg-dark-elevated"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="mb-1 grid grid-cols-7 text-center text-xs font-semibold text-gray-500 dark:text-dark-muted">
                        {weekDays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {calendarCells.map((day, index) => {
                            if (day === null) return <span key={`empty-${index}`} />;
                            const date = new Date(year, month, day);
                            const dateValue = toISODate(date);
                            const isSelected = value.slice(0, 10) === dateValue;
                            return (
                                <button
                                    key={dateValue}
                                    type="button"
                                    aria-label={new Intl.DateTimeFormat("es-PE", { dateStyle: "full" }).format(date)}
                                    aria-pressed={isSelected}
                                    onClick={() => {
                                        onChange(dateValue);
                                        setIsOpen(false);
                                    }}
                                    className={`h-9 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                        isSelected
                                            ? "bg-teal-600 font-semibold text-white"
                                            : "text-gray-700 hover:bg-teal-50 dark:text-dark-secondary dark:hover:bg-dark-elevated"
                                    }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePickerFuturistic;
