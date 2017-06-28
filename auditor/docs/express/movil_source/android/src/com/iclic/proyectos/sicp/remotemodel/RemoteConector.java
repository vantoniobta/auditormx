package com.iclic.proyectos.sicp.remotemodel;

import android.util.Log;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.RequestParams;

public class RemoteConector {
	private static final String BASE_URL = "http://dev.iclicauditor.com/api/v1";

	private static AsyncHttpClient client = new AsyncHttpClient();

	public static void get(String url, RequestParams params,
			AsyncHttpResponseHandler responseHandler) {
		client.setTimeout(20000);
		client.get(getAbsoluteUrl(url), params, responseHandler);
	}

	public static void post(String url, RequestParams params,
			AsyncHttpResponseHandler responseHandler) {
		client.setTimeout(20000);
		client.post(getAbsoluteUrl(url), params, responseHandler);
	}

	private static String getAbsoluteUrl(String relativeUrl) {
		String temp = BASE_URL + relativeUrl;
		Log.i("RemoteConector", temp);
		return temp;
	}

}
