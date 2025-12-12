import '../Style/footer.css'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">

                <div className="footer-logo">
                    <h2>SmartZen</h2>
                    <p>Your AI-powered health companion.</p>
                </div>

                <div className="footer-links">
                    <a href="/Home">Home</a>
                    <a href="/Dashboard">Dashboard</a>
                    <a href="/Upload">Uploads</a>
                    <a href="/Reports">Reports</a>
                    <a href="/SmartHelper">Smart Helper</a>
                </div>

                <div className="footer-info">
                    <p>Made with ❤️ for better health</p>
                    <p>© {new Date().getFullYear()} SmartZen. All rights reserved.</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
