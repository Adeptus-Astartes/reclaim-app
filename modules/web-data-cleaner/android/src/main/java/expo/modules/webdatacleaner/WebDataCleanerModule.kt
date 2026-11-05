package expo.modules.webdatacleaner

import android.webkit.CookieManager
import android.webkit.WebStorage
import android.webkit.WebView
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WebDataCleanerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WebDataCleaner")

    AsyncFunction("clearAllWebData") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("NO_ACTIVITY", "No current activity", null)
        return@AsyncFunction
      }

      activity.runOnUiThread {
        try {
          val cookieManager = CookieManager.getInstance()
          cookieManager.removeAllCookies {
            cookieManager.flush()
            WebStorage.getInstance().deleteAllData()
            WebView(activity).clearCache(true)
            promise.resolve(null)
          }
        } catch (error: Exception) {
          promise.reject("CLEAR_FAILED", error.message, error)
        }
      }
    }
  }
}
