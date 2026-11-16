import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangePickerProps {
    dateFrom: string;
    dateTo: string;
    onRangeSelect: (dateFrom: string, dateTo: string) => void;
    onClear: () => void;
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
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const formatDate = (value: string) => new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
}).format(parseISODate(value));

const DateRangePicker = ({
    dateFrom,
    dateTo,
    onRangeSelect,
    onClear,
    label = "Filtrar boletas por fechas",
}: DateRangePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pendingStart, setPendingStart] = useState<string | null>(null);
    const [displayMonth, setDisplayMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (event.target instanceof Node && !pickerRef.current?.contains(event.target)) {
                setIsOpen(false);
                setPendingStart(null);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                setPendingStart(null);
            }
        };

        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [isOpen]);

    const toggleCalendar = () => {
        if (isOpen) {
            setIsOpen(false);
            setPendingStart(null);
            return;
        }

        const referenceDate = dateFrom ? parseISODate(dateFrom) : new Date();
        setDisplayMonth(new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1));
        setPendingStart(null);
        setIsOpen(true);
    };

    const selectDay = (date: Date) => {
        const selectedDate = toISODate(date);
        if (!pendingStart) {
            setPendingStart(selectedDate);
            return;
        }

        const [rangeStart, rangeEnd] = pendingStart <= selectedDate
            ? [pendingStart, selectedDate]
            : [selectedDate, pendingStart];
        onRangeSelect(rangeStart, rangeEnd);
        setPendingStart(null);
        setIsOpen(false);
    };

    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const leadingDays = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarCells: (number | null)[] = [
        ...Array.from({ length: leadingDays }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
    const rangeStart = pendingStart ?? dateFrom;
    const rangeEnd = pendingStart ? "" : dateTo;
    const selectedLabel = dateFrom && dateTo
        ? dateFrom === dateTo
            ? formatDate(dateFrom)
            : `${formatDate(dateFrom)} - ${formatDate(dateTo)}`
        : "Seleccionar fechas";

    return (
        <div ref={pickerRef} className="relative w-full sm:max-w-xs">
            <label className="mb-2 block font-semibold text-gray-900 dark:text-dark-primary">
                {label}
            </label>
            <button
                type="button"
                aria-label="Abrir calendario de fechas"
                aria-expanded={isOpen}
                onClick={toggleCalendar}
                className="flex w-full items-center gap-3 rounded-lg border border-teal-500 bg-transparent px-4 py-2 text-left text-gray-900 shadow-md outline-none transition focus:ring-2 focus:ring-teal-500 dark:text-dark-primary"
            >
                <CalendarDays size={20} className="shrink-0 text-teal-500" />
                <span className="min-w-0 flex-1 truncate">{selectedLabel}</span>
                <span className="text-sm text-gray-500 dark:text-dark-muted">▾</span>
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label={`Calendario para ${label.toLocaleLowerCase()}`}
                    className="absolute left-0 z-30 mt-2 w-full min-w-[17rem] rounded-xl border border-teal-100 bg-white p-4 shadow-xl dark:border-dark-border dark:bg-dark-card"
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

                    <p className="mb-3 text-xs text-gray-500 dark:text-dark-muted">
                        {pendingStart
                            ? "Selecciona el último día; repite la fecha para filtrar solo ese día."
                            : "Selecciona el primer día del período."}
                    </p>

                    <div className="mb-1 grid grid-cols-7 text-center text-xs font-semibold text-gray-500 dark:text-dark-muted">
                        {weekDays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {calendarCells.map((day, index) => {
                            if (day === null) return <span key={`empty-${index}`} />;

                            const date = new Date(year, month, day);
                            const value = toISODate(date);
                            const isRangeStart = value === rangeStart;
                            const isRangeEnd = value === rangeEnd;
                            const isInRange = Boolean(rangeStart && rangeEnd && value >= rangeStart && value <= rangeEnd);
                            const isSelected = isRangeStart || isRangeEnd;
                            const className = isSelected
                                ? "bg-teal-600 font-semibold text-white"
                                : isInRange
                                    ? "bg-teal-100 text-teal-900 dark:bg-teal-900/50 dark:text-teal-100"
                                    : "text-gray-700 hover:bg-teal-50 dark:text-dark-secondary dark:hover:bg-dark-elevated";

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    aria-label={new Intl.DateTimeFormat("es-PE", { dateStyle: "full" }).format(date)}
                                    aria-pressed={isSelected}
                                    onClick={() => selectDay(date)}
                                    className={`h-9 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-dark-border">
                        <button
                            type="button"
                            disabled={!dateFrom && !dateTo}
                            onClick={() => {
                                onClear();
                                setPendingStart(null);
                                setIsOpen(false);
                            }}
                            className="text-sm font-medium text-teal-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-teal-300"
                        >
                            Limpiar
                        </button>
                        <span className="text-xs text-gray-400 dark:text-dark-muted">
                            {pendingStart ? formatDate(pendingStart) : selectedLabel}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
