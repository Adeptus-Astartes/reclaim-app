import ExpoModulesCore
import Foundation
import WebKit

public class WebDataCleanerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WebDataCleaner")

    AsyncFunction("clearAllWebData") { (promise: Promise) in
      DispatchQueue.main.async {
        if let cookies = HTTPCookieStorage.shared.cookies {
          for cookie in cookies {
            HTTPCookieStorage.shared.deleteCookie(cookie)
          }
        }

        WKWebsiteDataStore.default().removeData(
          ofTypes: WKWebsiteDataStore.allWebsiteDataTypes(),
          modifiedSince: Date.distantPast
        ) {
          promise.resolve()
        }
      }
    }
  }
}
