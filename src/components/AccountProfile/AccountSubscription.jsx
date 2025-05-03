import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FiCreditCard, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import "../AccountProfile/accountprofile.css";
import { toast } from "react-toastify";

const AccountSubscription = () => {
  const {
    data: subscription,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const response = await axios.get("/api/schools/subscriptions/");
      return response.data[0]; // First subscription in the list
    },
  });

  const updateSubscription = useMutation({
    mutationFn: (data) => axios.post("/api/schools/subscriptions/", data),
    onSuccess: () => {
      toast.success("Subscription updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update subscription"
      );
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: () =>
      axios.post("/api/schools/subscriptions/cancel_auto_renew/"),
    onSuccess: () => {
      toast.success("Auto-renew cancelled successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to cancel auto-renew"
      );
    },
  });

  const renewSubscription = useMutation({
    mutationFn: () => axios.post("/api/schools/subscriptions/renew/"),
    onSuccess: () => {
      toast.success("Subscription renewal initiated");
      refetch();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to renew subscription"
      );
    },
  });

  if (isLoading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="profile-subscription-container">
      <div className="profile-subscription-header">
        <h2>
          <FiCreditCard /> Subscription Management
        </h2>
        <p>View and manage your school's subscription plan</p>
      </div>

      <div className="profile-subscription-details">
        <div className="profile-subscription-plan">
          <h3>Current Plan: {subscription?.plan || "Basic"}</h3>
          <div className="plan-status">
            <span
              className={`status-badge ${subscription?.status?.toLowerCase()}`}
            >
              {subscription?.status || "Active"}
            </span>
          </div>
        </div>

        <div className="profile-subscription-dates">
          <div className="profile-date-item">
            <span className="profile-date-label">Start Date:</span>
            <span className="profile-date-value">
              {subscription?.start_date
                ? new Date(subscription.start_date).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="profile-date-item">
            <span className="profile-date-label">End Date:</span>
            <span className="profile-date-value">
              {subscription?.end_date
                ? new Date(subscription.end_date).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="profile-date-item">
            <span className="profile-date-label">Next Payment:</span>
            <span className="profile-date-value">
              {subscription?.next_payment_date
                ? new Date(subscription.next_payment_date).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        <div className="profile-subscription-features">
          <h4>Plan Features:</h4>
          <ul>
            {subscription?.plan === "BASIC" && (
              <>
                <li>
                  <FiCheck /> Up to 300 students
                </li>
                <li>
                  <FiCheck /> 10 teacher accounts
                </li>
                <li>
                  <FiCheck /> Core academic records
                </li>
                <li>
                  <FiCheck /> Basic reporting
                </li>
                <li>
                  <FiCheck /> Email support
                </li>
                <li>
                  <FiX /> Advanced analytics
                </li>
                <li>
                  <FiX /> Parent portal
                </li>
              </>
            )}
            {subscription?.plan === "STANDARD" && (
              <>
                <li>
                  <FiCheck /> Up to 1,000 students
                </li>
                <li>
                  <FiCheck /> 30 teacher accounts
                </li>
                <li>
                  <FiCheck /> Advanced reporting & analytics
                </li>
                <li>
                  <FiCheck /> Document management system
                </li>
                <li>
                  <FiCheck /> Priority email & chat support
                </li>
                <li>
                  <FiCheck /> Parent engagement portal
                </li>
                <li>
                  <FiX /> Custom reporting
                </li>
              </>
            )}
            {subscription?.plan === "ADVANCED" && (
              <>
                <li>
                  <FiCheck /> Unlimited students
                </li>
                <li>
                  <FiCheck /> Unlimited teacher accounts
                </li>
                <li>
                  <FiCheck /> Custom reporting & API access
                </li>
                <li>
                  <FiCheck /> Advanced document scanning
                </li>
                <li>
                  <FiCheck /> 24/7 phone support
                </li>
                <li>
                  <FiCheck /> Dedicated account manager
                </li>
                <li>
                  <FiCheck /> On-premise deployment option
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="profile-subscription-actions">
          <button
            className="profile-action-button primary"
            onClick={() => renewSubscription.mutate()}
            disabled={renewSubscription.isLoading}
          >
            <FiRefreshCw /> Renew Subscription
          </button>
          <button
            className="profile-action-button danger"
            onClick={() => cancelSubscription.mutate()}
            disabled={cancelSubscription.isLoading || !subscription?.auto_renew}
          >
            <FiX /> Cancel Auto-Renew
          </button>
        </div>

        <div className="payment-method">
          <h4>Payment Method:</h4>
          <div className="payment-details">
            <span className="payment-type">
              {subscription?.payment_method || "M-Pesa"}
            </span>
            <button className="profile-action-button">
              Change Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSubscription;
