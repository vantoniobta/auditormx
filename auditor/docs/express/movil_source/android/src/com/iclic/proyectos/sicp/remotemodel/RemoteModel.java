package com.iclic.proyectos.sicp.remotemodel;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import android.graphics.Bitmap;
import android.util.Log;

import com.iclic.proyectos.sicp.model.Foto;
import com.iclic.proyectos.sicp.model.Inventory;
import com.iclic.proyectos.sicp.model.Publicidad;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.RequestParams;

public class RemoteModel {
	public static void doLogin(String key, AsyncHttpResponseHandler handler) {
		RequestParams rp = new RequestParams();
		rp.put("key", key);

		RemoteConector.post("/signup", rp, handler);
	}
	
	public static MyInterface uploadFile (Publicidad pu, Foto f, UploadCallback callback){
		MyInterface ret = new MyInterface(){
			@Override
			public void onSuccess(String response) {
				callback.itemUploaded(response);
			}
			
			@Override
			public void onFailure(Throwable error,
                    String content){
				Log.i("Foto uplaod error", content+"");
			}
		};
		ret.callback = callback;
		
		ByteArrayOutputStream stream = new ByteArrayOutputStream();
		f.image.compress(Bitmap.CompressFormat.PNG, 100, stream);
		byte[] byteArray = stream.toByteArray();
		
		
		RequestParams rp = new RequestParams();
		
		
		rp.put("locCode", pu.pubId);
		rp.put("id", pu.extId);
		rp.put("timestamp", String.valueOf(f.timestamp));
		rp.put("longitud", f.lo);
		rp.put("latitud", f.la);
		rp.put("token", Publicidad.getUserTokenFromDB());
		
		Log.i("El id de la locacion es ", pu.extId);
		
		rp.put("image", new ByteArrayInputStream(byteArray), "image.png");
		RemoteConector.post("/uploadfile", rp, ret);
		return ret;
	}
	
	public static void uploadLocationReport(Publicidad p, AsyncHttpResponseHandler handler){
		
		RequestParams rp = new RequestParams();
		rp.put("locCode", p.pubId);
		rp.put("timestamp", String.valueOf(p.timestamp));
		rp.put("longitud", p.lo);
		rp.put("latitud", p.la);
		rp.put("status", p.type);
		rp.put("token", Publicidad.getUserTokenFromDB());

		RemoteConector.post("/emit", rp, handler);
	}
	
	public static MyInterface uploadFileInv (Inventory inv, Foto f, UploadCallback callback){
		MyInterface ret = new MyInterface(){
			@Override
			public void onSuccess(String response) {
				callback.itemUploaded(response);
			}
			
			@Override
			public void onFailure(Throwable error,
                    String content){
				Log.i("Foto uplaod error", content+"");
			}
		};
		ret.callback = callback;
		
		ByteArrayOutputStream stream = new ByteArrayOutputStream();
		f.image.compress(Bitmap.CompressFormat.PNG, 100, stream);
		byte[] byteArray = stream.toByteArray();
		
		
		RequestParams rp = new RequestParams();
		
		
		rp.put("locCode", inv.invId);
		rp.put("id", inv.extId);
		rp.put("timestamp", String.valueOf(f.timestamp));
		rp.put("longitud", f.lo);
		rp.put("latitud", f.la);
		rp.put("token", Publicidad.getUserTokenFromDB());
		
		Log.i("El id de la inventory es ", inv.extId);
		
		rp.put("image", new ByteArrayInputStream(byteArray), "image.png");
		RemoteConector.post("/uploadfile", rp, ret);
		return ret;
	}
	
public static void uploadLocationReportInv(Inventory i, AsyncHttpResponseHandler handler){
		
		RequestParams rp = new RequestParams();
		rp.put("locCode", i.invId);
		rp.put("timestamp", String.valueOf(i.timestamp));
		rp.put("longitud", i.lo);
		rp.put("latitud", i.la);
		rp.put("status", i.type);
		rp.put("token", Publicidad.getUserTokenFromDB());

		RemoteConector.post("/emit", rp, handler);
	}
	
	public static void getLocations(AsyncHttpResponseHandler handler){
		RequestParams rp = new RequestParams();
		rp.put("token", Publicidad.getUserTokenFromDB());

		RemoteConector.get("/locations", rp, handler);
	}
	
	public static void getInventories(String pubId,AsyncHttpResponseHandler handler){
		RequestParams rp = new RequestParams();
		rp.put("token", Publicidad.getUserTokenFromDB());
		rp.put("pub", pubId);

		RemoteConector.get("/inventories", rp, handler);
	}
}
