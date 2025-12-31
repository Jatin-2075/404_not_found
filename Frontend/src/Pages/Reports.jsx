import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Style/reports.css";
import { API_BASE_URL } from "../config/api";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      toast.error("Please login to view reports");
      navigate("/Login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/history/`, {
        method : "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.clear();
        navigate("/Login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch reports error:", err);
      toast.error("Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportId) => {
    setDownloadingId(reportId);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Please login to download reports");
        navigate("/Login");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/reports/download/${reportId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.clear();
        navigate("/Login");
        return;
      }

      if (!res.ok) {
        throw new Error("Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Medical_Report_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download report. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const shareReport = async (reportId, filename) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        toast.error("Please login to share reports");
        navigate("/Login");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/download/${reportId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.clear();
        navigate("/Login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch report");
      }

      const blob = await res.blob();
      const file = new File(
        [blob],
        filename || `Medical_Report_${reportId}.pdf`,
        { type: "application/pdf" }
      );

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Medical Report Summary",
          text: "Here is my medical report summary.",
        });
        toast.success("Report shared successfully");
      } else if (navigator.share) {
        const shareUrl = `${window.location.origin}/reports/${reportId}`;
        await navigator.share({
          title: "Medical Report Summary",
          text: "Here is my medical report summary.",
          url: shareUrl,
        });
        toast.success("Report shared successfully");
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || `Medical_Report_${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.info("Sharing not supported. File downloaded instead.");
      }
    } catch (err) {
      console.error("Share error:", err);
      toast.error("Failed to share report. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="reports-page-wrapper">
      <div className="reports-history-container">
        <h1 className="reports-main-title">Reports History</h1>
        <p className="reports-subtitle-text">
          View and download your previously analyzed medical reports.
        </p>

        {loading && (
          <div className="reports-loading-state">Loading reports...</div>
        )}

        {!loading && reports.length === 0 && (
          <div className="reports-empty-state">No reports uploaded yet.</div>
        )}

        <div className="reports-stack-list">
          {!loading &&
            reports.map((report) => (
              <div className="report-item-card" key={report.id}>
                <div className="report-item-content">
                  <h3 className="report-item-filename">
                    {report.filename || "Untitled Report"}
                  </h3>
                  <span className="report-item-date">
                    {report.uploaded_at
                      ? formatDate(report.uploaded_at)
                      : "Unknown date"}
                  </span>
                  <p className="report-item-summary">
                    {report.final_conclusion || "No summary available"}
                  </p>
                </div>

                <div className="report-item-actions">
                  <span
                    className={`status-pill-${
                      report.status === "Normal" ? "normal" : "attention"
                    }`}
                  >
                    {report.status || "Unknown"}
                  </span>

                  <div className="report-action-group">
                    <button
                      className="btn-download-action"
                      onClick={() => downloadReport(report.id)}
                      disabled={downloadingId === report.id}
                      type="button"
                    >
                      {downloadingId === report.id
                        ? "Downloading..."
                        : "Download"}
                    </button>

                    <button
                      className="btn-share-action"
                      onClick={() => shareReport(report.id, report.filename)}
                      disabled={downloadingId === report.id}
                      type="button"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;