package expo.modules.shareintent

import android.content.Intent
import android.net.Uri
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ShareIntentModule : Module() {
  private var pendingContent: Map<String, String>? = null

  override fun definition() = ModuleDefinition {
    Name("ShareIntent")

    Events("onSharedContent")

    AsyncFunction("consumePendingContent") {
      val content = pendingContent
      pendingContent = null
      content
    }

    OnNewIntent { intent ->
      val content = parseIntent(intent) ?: return@OnNewIntent
      this@ShareIntentModule.sendEvent("onSharedContent", content)
    }

    OnCreate {
      val intent = appContext?.currentActivity?.intent
      pendingContent = parseIntent(intent)
    }
  }

  private fun parseIntent(intent: Intent?): Map<String, String>? {
    if (intent?.action != Intent.ACTION_SEND) return null
    val extras = intent.extras ?: return null
    val text = extras.getCharSequence(Intent.EXTRA_TEXT)?.toString()
    val stream = extras.getParcelable(Intent.EXTRA_STREAM, Uri::class.java)
    val type = intent.type ?: ""

    return when {
      type.startsWith("image/") && stream != null ->
        mapOf("type" to "image", "value" to stream.toString())
      !text.isNullOrBlank() -> {
        val ct = if (text.startsWith("http://") || text.startsWith("https://")) "url" else "text"
        mapOf("type" to ct, "value" to text)
      }
      else -> null
    }
  }
}
