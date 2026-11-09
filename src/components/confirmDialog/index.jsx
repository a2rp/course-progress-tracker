import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "./styles.module.css";

const ConfirmDialog = ({ title, description, confirmLabel = "Delete", onCancel, onConfirm }) => {
    const dialogRef = useRef(null);
    const cancelRef = useRef(null);
    const onCancelRef = useRef(onCancel);
    useEffect(() => { onCancelRef.current = onCancel; }, [onCancel]);
    useEffect(() => {
        const previousFocus = document.activeElement;
        cancelRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCancelRef.current();
                return;
            }
            if (event.key !== "Tab" || !dialogRef.current) return;
            const controls = [...dialogRef.current.querySelectorAll("button:not([disabled]), a[href]")]
                .filter((element) => element.getClientRects().length);
            if (!controls.length) return;
            const activeIndex = controls.indexOf(document.activeElement);
            if (activeIndex === -1) {
                event.preventDefault();
                (event.shiftKey ? controls[controls.length - 1] : controls[0]).focus();
            } else if (event.shiftKey && activeIndex === 0) {
                event.preventDefault();
                controls[controls.length - 1].focus();
            } else if (!event.shiftKey && activeIndex === controls.length - 1) {
                event.preventDefault();
                controls[0].focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
        };
    }, []);
    return <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
        <section className={styles.dialog} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description">
            <span className={styles.icon}><FiAlertTriangle aria-hidden="true" /></span>
            <h2 id="confirm-title">{title}</h2>
            <p id="confirm-description">{description}</p>
            <div className={styles.actions}><button type="button" ref={cancelRef} onClick={onCancel}>Cancel</button><button type="button" className={styles.confirm} onClick={onConfirm}>{confirmLabel}</button></div>
        </section>
    </div>;
};

export default ConfirmDialog;
