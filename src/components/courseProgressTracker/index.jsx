import { useEffect, useMemo, useState } from "react";
import { FiArrowUpRight, FiBookOpen, FiCheck, FiClock, FiPlus, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../confirmDialog";
import styles from "./styles.module.css";

const starterCourses = [
    { id: "design", title: "Product design foundations", source: "Northstar School", done: 18, total: 32, color: "orange" },
    { id: "javascript", title: "JavaScript, step by step", source: "Open Learning", done: 11, total: 24, color: "blue" },
    { id: "writing", title: "Writing for the web", source: "Fieldnotes", done: 7, total: 12, color: "green" },
];
const readCourses = () => {
    try { return JSON.parse(localStorage.getItem("coursebook-courses")) || starterCourses; }
    catch { return starterCourses; }
};
const CourseProgressTracker = () => {
    const [courses, setCourses] = useState(readCourses);
    const [query, setQuery] = useState("");
    const [title, setTitle] = useState("");
    const [source, setSource] = useState("");
    const [pendingDelete, setPendingDelete] = useState(null);
    useEffect(() => localStorage.setItem("coursebook-courses", JSON.stringify(courses)), [courses]);
    const filtered = useMemo(() => courses.filter((course) => (course.title + " " + course.source).toLowerCase().includes(query.toLowerCase())), [courses, query]);
    const completed = courses.filter((course) => course.done >= course.total).length;
    const addCourse = (event) => {
        event.preventDefault();
        if (!title.trim() || !source.trim()) return;
        setCourses((items) => [{ id: crypto.randomUUID(), title: title.trim(), source: source.trim(), done: 0, total: 10, color: "blue" }, ...items]);
        setTitle(""); setSource("");
    };
    return (
        <section className={styles.courseProgressTracker} id="dashboard">
            <div className={styles.intro}>
                <div><p className={styles.label}>YOUR LEARNING, IN ONE PLACE</p><h1>Small steps add up.</h1><p className={styles.description}>Keep your courses moving, one lesson at a time.</p></div>
                <div className={styles.weekCard}><span className={styles.weekIcon}><FiBookOpen /></span><div><strong>{courses.length - completed}</strong><span>courses in progress</span></div><FiArrowUpRight className={styles.weekArrow} /></div>
            </div>
            <div className={styles.stats}>
                <article><span>Courses on your shelf</span><strong>{courses.length.toString().padStart(2, "0")}</strong></article>
                <article><span>Lessons completed</span><strong>{courses.reduce((sum, course) => sum + course.done, 0)}</strong></article>
                <article><span>Finished courses</span><strong>{completed}</strong></article>
                <article className={styles.goal}><FiClock /><span>This week</span><strong>3 lessons to go</strong></article>
            </div>
            <div className={styles.workspace} id="workspace">
                <div className={styles.sectionHead}><div><p className={styles.label}>YOUR COURSE SHELF</p><h2>Continue learning</h2></div><label className={styles.search}><span className={styles.visuallyHidden}>Search courses</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses" /></label></div>
                <div className={styles.courseGrid}>
                    {filtered.map((course) => {
                        const percent = Math.min(100, Math.round((course.done / course.total) * 100));
                        return <article className={styles.courseCard + " " + styles[course.color]} key={course.id}>
                            <div className={styles.cardTop}><span className={styles.courseIcon}><FiBookOpen /></span><button className={styles.deleteButton} type="button" aria-label={"Remove " + course.title} onClick={() => setPendingDelete(course)}><FiTrash2 /></button></div>
                            <p className={styles.source}>{course.source}</p><h3>{course.title}</h3>
                            <div className={styles.progressMeta}><span>{course.done} of {course.total} lessons</span><strong>{percent}%</strong></div>
                            <div className={styles.progressTrack} role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"><span style={{ width: String(percent) + "%" }} /></div>
                            <button className={styles.continueButton} type="button" disabled={percent >= 100} onClick={() => setCourses((items) => items.map((item) => item.id === course.id ? { ...item, done: Math.min(item.total, item.done + 1) } : item))}>{percent >= 100 ? <><FiCheck /> Course complete</> : <>Mark next lesson done <FiArrowUpRight /></>}</button>
                        </article>;
                    })}
                    {!filtered.length && <p className={styles.empty}>No courses match that search. Add one below.</p>}
                </div>
                <form className={styles.addForm} onSubmit={addCourse}>
                    <div className={styles.addIntro}><span><FiPlus /></span><div><h2>Add a course</h2><p>Start a new learning path on your shelf.</p></div></div>
                    <label>Course title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Intro to data science" required /></label>
                    <label>Provider<input value={source} onChange={(event) => setSource(event.target.value)} placeholder="e.g. Open Learning" required /></label>
                    <button type="submit">Add course <FiPlus /></button>
                </form>
            </div>
            {pendingDelete && <ConfirmDialog title="Remove this course?" description={pendingDelete.title + " will be removed from this browser's course shelf."} onCancel={() => setPendingDelete(null)} onConfirm={() => { setCourses((items) => items.filter((item) => item.id !== pendingDelete.id)); setPendingDelete(null); }} />}
        </section>
    );
};
export default CourseProgressTracker;
