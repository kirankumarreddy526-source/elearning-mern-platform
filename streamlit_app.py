import streamlit as st
import requests
import json
import os
import pandas as pd
from datetime import datetime

# Page Configuration
st.set_page_config(
    page_title="EduSphere | E-Learning Platform",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
    }
    .metric-card {
        background-color: #1e293b;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 1.2rem;
        color: white;
    }
    .badge {
        display: inline-block;
        padding: 0.2rem 0.6rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        margin-right: 0.4rem;
    }
    .badge-primary { background-color: rgba(99, 102, 241, 0.2); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.4); }
    .badge-success { background-color: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }
</style>
""", unsafe_allow_html=True)

# API Base URL (Local Node/Express backend or Cloud)
API_BASE_URL = os.getenv("API_URL", "http://localhost:5000/api")

# Session State Initialization
if "user" not in st.session_state:
    st.session_state.user = {
        "id": "student_01",
        "name": "Alex Student",
        "email": "student@elearning.com",
        "role": "student"
    }

if "token" not in st.session_state:
    st.session_state.token = None

if "local_courses" not in st.session_state:
    st.session_state.local_courses = [
        {
            "_id": "c1",
            "title": "Full-Stack MERN Architecture: Zero to Production",
            "subtitle": "Master Node.js, Express, MongoDB, React, JWT auth, Stripe payments and Cloudinary uploads.",
            "description": "An exhaustive masterclass covering real-world architecture. Build production-grade backends with role-based access control, secure payment pipelines with Stripe, file storage via Cloudinary, and high-performance React frontends.",
            "category": "Web Development",
            "level": "Intermediate",
            "price": 49.99,
            "thumbnail": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
            "tutor": {"name": "Dr. Marcus Vance", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"},
            "enrolledCount": 142,
            "averageRating": 4.9,
            "lessons": [
                {
                    "_id": "l1",
                    "title": "1. Introduction to MERN System Architecture",
                    "duration": "15 min",
                    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    "pdfUrl": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    "isFreePreview": True
                },
                {
                    "_id": "l2",
                    "title": "2. JWT Authentication & Role-Based Authorization",
                    "duration": "25 min",
                    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                    "pdfUrl": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    "isFreePreview": False
                },
                {
                    "_id": "l3",
                    "title": "3. Cloudinary Integration for Media & PDF Materials",
                    "duration": "20 min",
                    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    "pdfUrl": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    "isFreePreview": False
                }
            ]
        },
        {
            "_id": "c2",
            "title": "React 18 & Modern State Management Essentials",
            "subtitle": "Complete guide to React Hooks, Context API, Tailwind CSS, and resilient component design.",
            "description": "Learn modern React from scratch. We cover declarative UI principles, state lifecycles, custom hooks, and best practices for building responsive single-page applications.",
            "category": "Web Development",
            "level": "Beginner",
            "price": 0.0,
            "thumbnail": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
            "tutor": {"name": "Dr. Marcus Vance", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"},
            "enrolledCount": 380,
            "averageRating": 4.8,
            "lessons": [
                {
                    "_id": "l4",
                    "title": "1. React 18 Core Concepts & Project Bootstrapping",
                    "duration": "12 min",
                    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    "pdfUrl": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    "isFreePreview": True
                },
                {
                    "_id": "l5",
                    "title": "2. Hooks Deep Dive: useState & useEffect",
                    "duration": "18 min",
                    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                    "pdfUrl": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    "isFreePreview": True
                }
            ]
        },
        {
            "_id": "c3",
            "title": "Practical Cloud & DevOps with Docker and Kubernetes",
            "subtitle": "Deploy, scale, and monitor microservices using Docker, Render, Vercel and CI/CD pipelines.",
            "description": "Learn continuous deployment and container orchestration. Package your MERN apps in Docker containers, configure environment secrets safely, and deploy to modern cloud providers.",
            "category": "Cloud & DevOps",
            "level": "Advanced",
            "price": 69.99,
            "thumbnail": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80",
            "tutor": {"name": "Dr. Marcus Vance", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"},
            "enrolledCount": 95,
            "averageRating": 4.9,
            "lessons": [
                {
                    "_id": "l6",
                    "title": "1. Containerizing Full-Stack Applications",
                    "duration": "20 min",
                    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    "pdfUrl": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    "isFreePreview": True
                }
            ]
        }
    ]

if "enrollments" not in st.session_state:
    st.session_state.enrollments = {
        "c1": {"completed_lessons": ["l1"], "progress": 33},
        "c2": {"completed_lessons": ["l4", "l5"], "progress": 100}
    }

# Try fetching live courses from Express Backend if running
def fetch_backend_courses():
    try:
        r = requests.get(f"{API_BASE_URL}/courses", timeout=2)
        if r.status_code == 200:
            data = r.json()
            if data.get("success") and data.get("courses"):
                return data["courses"]
    except Exception:
        pass
    return st.session_state.local_courses

all_courses = fetch_backend_courses()

# ----------------- SIDEBAR CONTROLS -----------------
with st.sidebar:
    st.markdown('<div class="main-header">EduSphere 🎓</div>', unsafe_allow_html=True)
    st.caption("MERN + Streamlit E-Learning Platform")
    st.divider()

    st.subheader("Switch Active Role")
    role_choice = st.radio(
        "Choose Persona:",
        ["🎓 Student (Alex)", "👨‍🏫 Tutor (Dr. Marcus)", "🛡️ Admin (Eleanor)"],
        index=0 if st.session_state.user["role"] == "student" else (1 if st.session_state.user["role"] == "tutor" else 2)
    )

    if "Student" in role_choice:
        st.session_state.user = {"id": "student_01", "name": "Alex Student", "email": "student@elearning.com", "role": "student"}
    elif "Tutor" in role_choice:
        st.session_state.user = {"id": "tutor_01", "name": "Dr. Marcus Vance", "email": "tutor@elearning.com", "role": "tutor"}
    elif "Admin" in role_choice:
        st.session_state.user = {"id": "admin_01", "name": "Eleanor Admin", "email": "admin@elearning.com", "role": "admin"}

    st.info(f"**Logged in as:** {st.session_state.user['name']}\n\n**Role:** `{st.session_state.user['role']}`")
    st.divider()

    # Backend Connection Indicator
    try:
        health_check = requests.get(f"{API_BASE_URL}/health", timeout=1)
        if health_check.status_code == 200:
            st.success("🟢 Express REST API: Connected")
        else:
            st.warning("🟡 Express REST API: Standby")
    except Exception:
        st.info("⚪ Running in Streamlit Standalone Mode")

    st.divider()
    st.markdown("**Tech Stack:**\n- MongoDB & Mongoose\n- Express.js REST API\n- Cloudinary Media Streaming\n- Stripe Payment Gateway\n- React + Streamlit Frontends")


# ----------------- ROLE-BASED DASHBOARDS -----------------

# ================= 1. STUDENT DASHBOARD =================
if st.session_state.user["role"] == "student":
    student_tab1, student_tab2 = st.tabs(["📚 Course Catalog & Enrollment", "💻 My Classroom & Progress Tracker"])

    with student_tab1:
        st.header("Explore Courses")
        st.write("Browse courses, inspect free previews, and enroll via Stripe or 1-Click Free access.")

        # Filter bar
        col_search, col_cat, col_price = st.columns([3, 2, 2])
        with col_search:
            search_query = st.text_input("🔍 Search courses:", placeholder="Search title or keyword...")
        with col_cat:
            cat_filter = st.selectbox("Category:", ["All", "Web Development", "Cloud & DevOps", "Data Science & AI"])
        with col_price:
            price_filter = st.selectbox("Price Filter:", ["All", "Free ($0)", "Paid"])

        # Filter list
        filtered = all_courses
        if search_query:
            filtered = [c for c in filtered if search_query.lower() in c["title"].lower() or search_query.lower() in c.get("subtitle", "").lower()]
        if cat_filter != "All":
            filtered = [c for c in filtered if c.get("category") == cat_filter]
        if price_filter == "Free ($0)":
            filtered = [c for c in filtered if c.get("price") == 0]
        elif price_filter == "Paid":
            filtered = [c for c in filtered if c.get("price", 0) > 0]

        st.caption(f"Showing {len(filtered)} courses")

        # Course Cards Grid
        cols = st.columns(3)
        for idx, course in enumerate(filtered):
            with cols[idx % 3]:
                st.image(course.get("thumbnail", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"), use_container_width=True)
                st.markdown(f"**{course['title']}**")
                st.caption(f"{course.get('category', 'Tech')} • {course.get('level', 'Beginner')} • ⭐ {course.get('averageRating', 4.8)}")

                price = course.get("price", 0)
                price_str = "FREE" if price == 0 else f"${price:.2f}"
                st.markdown(f"**Price:** `{price_str}`")

                course_id = str(course.get("_id", idx))
                is_enrolled = course_id in st.session_state.enrollments

                with st.expander("📖 View Syllabus & Preview"):
                    st.write(course.get("description", ""))
                    st.write("**Lessons:**")
                    for lesson in course.get("lessons", []):
                        preview_badge = " [Free Preview]" if lesson.get("isFreePreview") else ""
                        st.write(f"- {lesson.get('title')} ({lesson.get('duration', '10m')}){preview_badge}")

                if is_enrolled:
                    st.success("✅ Already Enrolled")
                else:
                    if price == 0:
                        if st.button(f"Enroll Free 🚀", key=f"enroll_{course_id}"):
                            st.session_state.enrollments[course_id] = {"completed_lessons": [], "progress": 0}
                            st.success(f"Enrolled in {course['title']}!")
                            st.rerun()
                    else:
                        if st.button(f"Buy with Stripe 💳", key=f"buy_{course_id}"):
                            st.session_state.enrollments[course_id] = {"completed_lessons": [], "progress": 0}
                            st.balloons()
                            st.success(f"Stripe payment of ${price:.2f} completed! You are now enrolled.")
                            st.rerun()
                st.divider()

    with student_tab2:
        st.header("My Learning Classroom")
        enrolled_ids = list(st.session_state.enrollments.keys())

        if not enrolled_ids:
            st.warning("You have not enrolled in any courses yet. Go to the Catalog tab to enroll!")
        else:
            enrolled_courses = [c for c in all_courses if str(c.get("_id")) in enrolled_ids]
            selected_course_title = st.selectbox(
                "Select Active Course:",
                [c["title"] for c in enrolled_courses]
            )

            selected_course = next((c for c in enrolled_courses if c["title"] == selected_course_title), None)

            if selected_course:
                course_id = str(selected_course.get("_id"))
                enrollment_info = st.session_state.enrollments[course_id]
                lessons = selected_course.get("lessons", [])
                completed_ids = enrollment_info.get("completed_lessons", [])

                progress_percent = int(len(completed_ids) / len(lessons) * 100) if lessons else 0
                st.session_state.enrollments[course_id]["progress"] = progress_percent

                # Progress Display
                st.subheader(f"Progress: {progress_percent}%")
                st.progress(progress_percent / 100)

                if progress_percent == 100:
                    st.success("🎉 Congratulations! You have completed 100% of this course!")

                col_player, col_syllabus = st.columns([2, 1])

                with col_syllabus:
                    st.write("### Lessons Checklist")
                    selected_lesson_idx = 0
                    for i, lesson in enumerate(lessons):
                        l_id = str(lesson.get("_id", i))
                        is_checked = l_id in completed_ids

                        check = st.checkbox(
                            f"{lesson['title']} ({lesson.get('duration', '10m')})",
                            value=is_checked,
                            key=f"chk_{course_id}_{l_id}"
                        )

                        if check and l_id not in completed_ids:
                            completed_ids.append(l_id)
                            st.session_state.enrollments[course_id]["completed_lessons"] = completed_ids
                            new_prog = int(len(completed_ids) / len(lessons) * 100)
                            if new_prog == 100:
                                st.balloons()
                            st.rerun()
                        elif not check and l_id in completed_ids:
                            completed_ids.remove(l_id)
                            st.session_state.enrollments[course_id]["completed_lessons"] = completed_ids
                            st.rerun()

                    lesson_titles = [l["title"] for l in lessons]
                    chosen_lesson_title = st.radio("Stream Lesson Video:", lesson_titles)
                    chosen_lesson = next((l for l in lessons if l["title"] == chosen_lesson_title), lessons[0])

                with col_player:
                    st.write(f"### Now Streaming: {chosen_lesson['title']}")
                    video_url = chosen_lesson.get("videoUrl")
                    if video_url:
                        st.video(video_url)
                    else:
                        st.info("No video lecture URL attached.")

                    if chosen_lesson.get("pdfUrl"):
                        st.markdown(f"📄 **Study Material:** [Download PDF Guide & Notes]({chosen_lesson['pdfUrl']})")


# ================= 2. TUTOR DASHBOARD =================
elif st.session_state.user["role"] == "tutor":
    tutor_tab1, tutor_tab2 = st.tabs(["📊 Tutor Studio & Analytics", "➕ Create New Masterclass"])

    with tutor_tab1:
        st.header("Tutor Studio")
        st.write("Manage your curricula, upload video lectures and PDFs, and monitor student metrics.")

        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Total Courses", len(all_courses))
        with col2:
            st.metric("Total Students Enrolled", sum(c.get("enrolledCount", 0) for c in all_courses) + 3)
        with col3:
            total_rev = sum(c.get("price", 0) * c.get("enrolledCount", 0) for c in all_courses)
            st.metric("Stripe Revenue", f"${total_rev:,.2f}")

        st.subheader("Your Published Courses")
        for course in all_courses:
            with st.expander(f"📚 {course['title']} (${course.get('price', 0):.2f})"):
                st.write(f"**Category:** {course.get('category')} | **Level:** {course.get('level')}")
                st.write(f"**Enrolled Students:** {course.get('enrolledCount', 0)}")
                st.write(f"**Total Lessons:** {len(course.get('lessons', []))}")

                st.write("---")
                st.write("**Add a New Lesson to this Course:**")
                with st.form(key=f"add_lesson_{course.get('_id')}"):
                    nl_title = st.text_input("Lesson Title", placeholder="e.g. 4. Advanced System Design")
                    nl_duration = st.text_input("Duration", value="15 min")
                    nl_video = st.text_input("Cloudinary Video URL", value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
                    nl_pdf = st.text_input("Cloudinary PDF URL", value="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
                    nl_preview = st.checkbox("Allow Free Preview")

                    if st.form_submit_button("Add Lesson"):
                        if nl_title:
                            course.setdefault("lessons", []).append({
                                "_id": f"l_{datetime.now().timestamp()}",
                                "title": nl_title,
                                "duration": nl_duration,
                                "videoUrl": nl_video,
                                "pdfUrl": nl_pdf,
                                "isFreePreview": nl_preview
                            })
                            st.success(f"Lesson added to {course['title']}!")
                            st.rerun()

    with tutor_tab2:
        st.header("Publish a New Course")
        with st.form(key="create_course_form"):
            new_title = st.text_input("Course Title*", placeholder="e.g. Next.js 14 & Server Actions Mastery")
            new_subtitle = st.text_input("Short Subtitle", placeholder="Production grade web architecture")
            new_desc = st.text_area("Full Description*", placeholder="Comprehensive course syllabus and prerequisites...")

            c1, c2, c3 = st.columns(3)
            with c1:
                new_cat = st.selectbox("Category", ["Web Development", "Mobile Development", "Data Science & AI", "Cloud & DevOps", "UI/UX Design"])
            with c2:
                new_level = st.selectbox("Difficulty Level", ["Beginner", "Intermediate", "Advanced", "All Levels"])
            with c3:
                new_price = st.number_input("Price ($ USD - 0 for Free)", min_value=0.0, value=29.99, step=1.0)

            new_thumb = st.text_input("Thumbnail Image URL", value="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80")

            if st.form_submit_button("🚀 Launch Course"):
                if new_title and new_desc:
                    new_course_obj = {
                        "_id": f"c_{datetime.now().timestamp()}",
                        "title": new_title,
                        "subtitle": new_subtitle,
                        "description": new_desc,
                        "category": new_cat,
                        "level": new_level,
                        "price": float(new_price),
                        "thumbnail": new_thumb,
                        "tutor": {"name": st.session_state.user["name"], "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"},
                        "enrolledCount": 0,
                        "averageRating": 5.0,
                        "lessons": []
                    }
                    st.session_state.local_courses.append(new_course_obj)
                    st.balloons()
                    st.success(f"Course '{new_title}' published successfully! Switch to the Tutor Studio tab to add lessons.")
                else:
                    st.error("Please fill in the title and description.")


# ================= 3. ADMIN DASHBOARD =================
elif st.session_state.user["role"] == "admin":
    st.header("🛡️ Platform Administration & Telemetry")
    st.write("Complete system oversight: users, courses, moderation, and Stripe transaction logs.")

    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.metric("Total Platform Users", "3 Accounts")
    with m2:
        st.metric("Published Courses", len(all_courses))
    with m3:
        st.metric("Total Enrollments", "520 Enrollments")
    with m4:
        st.metric("Gross Volume (Stripe)", "$13,840.00")

    admin_tab1, admin_tab2, admin_tab3 = st.tabs(["👥 User Management", "📚 Course Moderation", "💳 Stripe Transactions"])

    with admin_tab1:
        st.subheader("Platform Users (RBAC)")
        users_df = pd.DataFrame([
            {"Name": "Alex Student", "Email": "student@elearning.com", "Role": "student", "Status": "Active"},
            {"Name": "Dr. Marcus Vance", "Email": "tutor@elearning.com", "Role": "tutor", "Status": "Active"},
            {"Name": "Eleanor Admin", "Email": "admin@elearning.com", "Role": "admin", "Status": "Active"},
            {"Name": "John Doe", "Email": "john@example.com", "Role": "student", "Status": "Suspended"}
        ])
        st.dataframe(users_df, use_container_width=True)

        st.write("---")
        st.write("**Manage User Status:**")
        col_u, col_act = st.columns(2)
        with col_u:
            selected_user = st.selectbox("Select User:", users_df["Email"].tolist())
        with col_act:
            action = st.radio("Action:", ["Set Active", "Suspend Account", "Promote to Tutor"])
            if st.button("Apply User Change"):
                st.success(f"Action '{action}' applied to {selected_user}!")

    with admin_tab2:
        st.subheader("Course Moderation")
        for c in all_courses:
            col_info, col_del = st.columns([4, 1])
            with col_info:
                st.write(f"**{c['title']}** — Category: `{c.get('category')}` | Price: `${c.get('price', 0):.2f}` | Enrolled: `{c.get('enrolledCount', 0)}`")
            with col_del:
                if st.button("Delete Course", key=f"del_admin_{c.get('_id')}"):
                    st.warning(f"Course '{c['title']}' flagged for removal.")

    with admin_tab3:
        st.subheader("Recent Stripe Payments")
        payments_df = pd.DataFrame([
            {"Date": "2026-10-04", "Student": "Alex Student", "Course": "Full-Stack MERN Architecture", "Amount": "$49.99", "Status": "Completed"},
            {"Date": "2026-10-03", "Student": "Sarah Lee", "Course": "Cloud & DevOps with Docker", "Amount": "$69.99", "Status": "Completed"},
            {"Date": "2026-10-02", "Student": "David Miller", "Course": "Full-Stack MERN Architecture", "Amount": "$49.99", "Status": "Completed"}
        ])
        st.dataframe(payments_df, use_container_width=True)

st.markdown("---")
st.caption("EduSphere Platform • MERN Stack & Streamlit Interactive Architecture")
