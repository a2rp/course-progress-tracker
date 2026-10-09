import { useEffect, useState } from "react";
import styles from "./App.module.css";
import SiteHeader from "./components/siteHeader";
import SiteFooter from "./components/siteFooter";
import BackToTop from "./components/backToTop";
import CourseProgressTracker from "./components/courseProgressTracker";

const App = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <div className={styles["app-shell"]} id="top">
            <SiteHeader title="Coursebook" mark="C" navItems={[["Courses", "#dashboard"], ["My progress", "#workspace"]]} repoUrl="https://github.com/a2rp/course-progress-tracker" />
            <main className={styles.pageContent}>
                <CourseProgressTracker />
            </main>
            <SiteFooter repoUrl="https://github.com/a2rp/course-progress-tracker" />
            <BackToTop visible={showBackToTop} />
        </div>
    );
};

export default App;
