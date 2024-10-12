document.addEventListener("DOMContentLoaded", function () {
  const usernameDisplay = document.getElementById("usernameDisplay");
  const loggedInUser = localStorage.getItem("loggedInUser");

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const storedUser = localStorage.getItem(`user_${username}`);
      if (!storedUser) {
        alert("Username not found. Please sign up first.");
        return;
      }

      const userData = JSON.parse(storedUser);
      if (password === userData.password) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "dashboard.html";
      } else {
        alert("Incorrect password. Please try again.");
      }
    });
  }

  // Handle Google Sign-In
  function handleCredentialResponse(response) {
    const userObject = jwt_decode(response.credential);
    console.log("User Info:", userObject); // Display user info

    // Store user in localStorage
    localStorage.setItem("loggedInUser", userObject.name);
    window.location.href = "dashboard.html";
  }

  // Initialize the Google Sign-In button
  window.onload = function () {
    google.accounts.id.initialize({
      client_id:
        "132804289720-d9jch8jbciemd4m2qejjv8c83u6niocu.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(document.querySelector(".g_id_signin"), {
      theme: "outline",
      size: "large",
    });
    google.accounts.id.prompt();
  };

  // Handle Facebook Sign-In

  window.fbAsyncInit = function() {
    FB.init({
        appId      : 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID
        cookie     : true, 
        xfbml      : true, 
        version    : 'v12.0'
    });

    FB.AppEvents.logPageView();   

    // Handle the Facebook login status
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

// Handle the Facebook login response.

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        FB.api('/me', function(response) {
            console.log('User Info:', response);
            localStorage.setItem('loggedInUser', response.name);
            window.location.href = 'dashboard.html';
        });
    } else {
        console.log('User is not authenticated with Facebook.');
    }
}

// Trigger Facebook login
document.querySelector('.fb-login-button').addEventListener('click', function() {
    FB.login(function(response) {
        if (response.status === 'connected') {
            FB.api('/me', function(user) {
                console.log('User Info:', user);
                localStorage.setItem('loggedInUser', user.name);
                window.location.href = 'dashboard.html';
            });
        }
    }, {scope: 'public_profile,email'});
});




  // Handle sign-up form submission
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const newUsername = document.getElementById("newUsername").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      const existingUser = localStorage.getItem(`user_${newUsername}`);
      if (existingUser) {
        alert("Username already exists. Please choose a different username.");
        return;
      }

      localStorage.setItem(
        `user_${newUsername}`,
        JSON.stringify({ password: newPassword })
      );
      alert("Account created successfully! You can now log in.");
      window.location.href = "index.html";
    });
  }

  // Handle dashboard user display
  if (usernameDisplay && loggedInUser) {
    usernameDisplay.textContent = loggedInUser;
  }

  // Handle "Back to Dashboard" button
  const backToDashboardBtn = document.getElementById("backToDashboard");
  if (backToDashboardBtn) {
    backToDashboardBtn.addEventListener("click", function () {
      window.location.href = "dashboard.html";
    });
  }

  // Handle log out
  const logOutBtn = document.getElementById("logOutBtn");
  if (logOutBtn) {
    logOutBtn.addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    });
  }

  // Handle habit logging
  const habitForms = {
    waterForm: "water",
    mealsForm: "meals",
    exerciseForm: "exercise",
    sleepForm: "sleep",
    moodForm: "mood",
  };

  Object.keys(habitForms).forEach((formId) => {
    const formElement = document.getElementById(formId);
    if (formElement) {
      formElement.addEventListener("submit", function (event) {
        event.preventDefault();
        const habitValue = document.getElementById(habitForms[formId]).value;
        const habitData =
          JSON.parse(
            localStorage.getItem(`habits_${loggedInUser}_${habitForms[formId]}`)
          ) || [];

        habitData.push({
          date: new Date().toISOString().split("T")[0],
          value: habitValue,
        });

        localStorage.setItem(
          `habits_${loggedInUser}_${habitForms[formId]}`,
          JSON.stringify(habitData)
        );
        alert(`${habitForms[formId]} logged successfully!`);
        window.location.href = "dashboard.html";
      });
    }
  });

  // Chart.js for habit data
  const chartContainers = {
    waterChart: "water",
    mealsChart: "meals",
    exerciseChart: "exercise",
    sleepChart: "sleep",
    calorieChart: "calories",
  };

  Object.keys(chartContainers).forEach((chartId) => {
    const chartElement = document.getElementById(chartId);
    if (chartElement) {
      const habitData =
        JSON.parse(
          localStorage.getItem(
            `habits_${loggedInUser}_${chartContainers[chartId]}`
          )
        ) || [];
      const labels = habitData.map((entry) => entry.date);
      const data = habitData.map((entry) => entry.value);

      new Chart(chartElement, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: `${chartContainers[chartId]} data over the past 7 days`,
              data: data,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  });
});

    // Handle habit logging for calories
    const calorieForm = document.getElementById('calorieForm');
    if (calorieForm) {
        calorieForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const calorieValue = document.getElementById('calories').value;
            const calorieData = JSON.parse(localStorage.getItem(`habits_${loggedInUser}_calories`)) || [];

            calorieData.push({
                date: new Date().toISOString().split('T')[0],
                value: calorieValue,
            });

            localStorage.setItem(`habits_${loggedInUser}_calories`, JSON.stringify(calorieData));
            alert('Calories logged successfully!');
            window.location.href = 'dashboard.html';
        });
    }

    //Display calorie data on chart
    const calorieChartElement = document.getElementById('calorieChart');
    if (calorieChartElement) {
        const calorieData = JSON.parse(localStorage.getItem(`habits_${loggedInUser}_calories`)) || [];
        const labels = calorieData.map((entry) => entry.date);
        const data = calorieData.map((entry) => entry.value);

        new Chart(calorieChartElement, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Calories over the past 7 days',
                    data: data,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }