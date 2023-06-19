package com.example.testproj;

import java.net.*;
import java.io.*;

import org.json.*;

import android.os.Bundle;
import android.view.View;
import android.text.Html;
import android.widget.*;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.*;

public class MainActivity extends AppCompatActivity {

    private Button loginButton;
    private Button signupButton;
    private static final String TAG = "MainActivity";
    private String token;
    private final String ipAddress = BuildConfig.MY_IP;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // For printing json nicely
        Gson gson = new GsonBuilder().setPrettyPrinting().create();

        loginButton = findViewById(R.id.loginButton);

        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String serverUrl = "http://" + ipAddress + ":3000/login";

                // Get field data from the form
                String username = ((EditText) findViewById(R.id.usernameField)).getText().toString();
                String password = ((EditText) findViewById(R.id.passwordField)).getText().toString();

                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            URL url = new URL(serverUrl);
                            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                            connection.setRequestMethod("POST");

                            // Set the request headers
                            connection.setRequestProperty("Content-Type", "application/json");
                            connection.setRequestProperty("Accept", "application/json");

                            // Enable output and disable caching
                            connection.setDoOutput(true);
                            connection.setUseCaches(false);

                            // Construct the JSON data to send
                            JSONObject jsonData = new JSONObject();
                            try {
                                jsonData.put("username", username);
                                jsonData.put("password", password);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }

                            // Write the JSON data to the output stream
                            DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream());
                            outputStream.writeBytes(jsonData.toString());
                            outputStream.flush();
                            outputStream.close();

                            int responseCode = connection.getResponseCode();

                            if (responseCode == HttpURLConnection.HTTP_OK) {

                                // Read the response body
                                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                                StringBuilder response = new StringBuilder();
                                String line;
                                while ((line = reader.readLine()) != null) {
                                    response.append(line);
                                }
                                reader.close();

                                JsonObject jsonObject = gson.fromJson(response.toString(), JsonObject.class);
                                token = jsonObject.getAsJsonObject("data").get("token").getAsString();

                                // Update TextView on the main UI thread
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        TextView textView = findViewById(R.id.responseText);
                                        // Set the formatted JSON string to the TextView
                                        textView.setText("Login successful. User token: " + token);
                                    }
                                });
                            } else {
                                // Update TextView on the main UI thread
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        TextView textView = findViewById(R.id.responseText);
                                        // Set the formatted JSON string to the TextView
                                        textView.setText("Login Failed");
                                    }
                                });
                            }

                            // Close the connection
                            connection.disconnect();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }).start();
            }
        });

        signupButton = findViewById(R.id.signupButton);

        signupButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String serverUrl = "http://" + ipAddress + ":3000/signup";

                // Get field data from the form
                String username = ((EditText) findViewById(R.id.usernameField)).getText().toString();
                String password = ((EditText) findViewById(R.id.passwordField)).getText().toString();

                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            URL url = new URL(serverUrl);
                            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                            connection.setRequestMethod("POST");

                            // Set the request headers
                            connection.setRequestProperty("Content-Type", "application/json");
                            connection.setRequestProperty("Accept", "application/json");

                            // Enable output and disable caching
                            connection.setDoOutput(true);
                            connection.setUseCaches(false);

                            // Construct the JSON data to send
                            JSONObject jsonData = new JSONObject();
                            try {
                                jsonData.put("username", username);
                                jsonData.put("password", password);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }

                            // Write the JSON data to the output stream
                            DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream());
                            outputStream.writeBytes(jsonData.toString());
                            outputStream.flush();
                            outputStream.close();

                            int responseCode = connection.getResponseCode();

                            if (responseCode == HttpURLConnection.HTTP_OK) {

                                // Read the response body
                                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                                StringBuilder response = new StringBuilder();
                                String line;
                                while ((line = reader.readLine()) != null) {
                                    response.append(line);
                                }
                                reader.close();

                                JsonObject jsonObject = gson.fromJson(response.toString(), JsonObject.class);
                                token = jsonObject.getAsJsonObject("result").get("token").getAsString();

                                // Update TextView on the main UI thread
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        TextView textView = findViewById(R.id.responseText);
                                        // Set the formatted JSON string to the TextView
                                        textView.setText("Signup successful. User token: " + token);
                                    }
                                });
                            } else {
                                // Update TextView on the main UI thread
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        TextView textView = findViewById(R.id.responseText);
                                        // Set the formatted JSON string to the TextView
                                        textView.setText("Signup Failed");
                                    }
                                });
                            }

                            // Close the connection
                            connection.disconnect();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }).start();
            }
        });
    }
}