#[cfg(target_os = "linux")]
const INSTALL_SCRIPT: &str = include_str!("../../install.sh");

#[cfg(target_os = "linux")]
#[tauri::command]
async fn run_updater() -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(|| {
        use std::io::Write;
        use std::process::{Command, Stdio};

        let mut child = Command::new("sh")
            .args(["-s", "--", "--skip-dependency-check"])
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("Failed to start updater: {e}"))?;

        let mut stdin = child
            .stdin
            .take()
            .ok_or_else(|| "Failed to open updater input".to_string())?;
        stdin
            .write_all(INSTALL_SCRIPT.as_bytes())
            .map_err(|e| format!("Failed to send installer: {e}"))?;
        drop(stdin);

        let output = child
            .wait_with_output()
            .map_err(|e| format!("Failed to run updater: {e}"))?;

        if output.status.success() {
            Ok(String::from_utf8_lossy(&output.stdout).to_string())
        } else {
            Err(format!(
                "Update failed (exit {}):\n{}",
                output.status.code().unwrap_or(-1),
                String::from_utf8_lossy(&output.stderr)
            ))
        }
    })
    .await
    .map_err(|e| format!("Updater task failed: {e}"))?
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            #[cfg(target_os = "linux")]
            run_updater
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
