package com.iclic.proyectos.sicp.model;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;

import com.iclic.proyectos.sicp.remotemodel.RemoteModel;
import com.iclic.proyectos.sicp.remotemodel.UploadCallback;


public class Foto{
	
	int pos = -1;
	
	long extId;

	public long timestamp;
	
	public String bin,lo,la;
	boolean uploaded;
	
	public Bitmap image = null;
	
	Publicidad pub;
	Inventory inv;
	
	public Foto(){
		timestamp =  System.currentTimeMillis()/1000;
		extId = 0;
		if (Publicidad.lastLocation != null){
			lo =  String.valueOf( Publicidad.lastLocation.getLongitude());
			la =  String.valueOf( Publicidad.lastLocation.getLatitude());
		}
	}
	public Foto(Bitmap img){
		this();
		this.image = img;
		this.bin = bitmapToBase64(this.image);
	}
	
	public String bitmapToBase64(Bitmap bm){
		ByteArrayOutputStream baos = new ByteArrayOutputStream();  
		bm.compress(Bitmap.CompressFormat.JPEG, 100, baos); //bm is the bitmap object   
		byte[] b = baos.toByteArray();
		return Base64.encodeToString(b, Base64.DEFAULT);
	}
	public Bitmap base64ToBitmap(String base){
		byte[] imageAsBytes = Base64.decode(base,	Base64.DEFAULT);
		return BitmapFactory.decodeByteArray(imageAsBytes, 0, imageAsBytes.length);
	}
	
	public static ArrayList<Foto> GetAll(SharedPreferences prefs, int pub, Publicidad p){
		ArrayList<Foto> ret = new ArrayList<Foto>();

	    int items = prefs.getInt("item_"+pub+"_fotos", 0);
	    for (int n = 1; n<=items; n++){
	    	ret.add(FotoWithPrefs(prefs,pub,n, p));
	    }
	    
	    return ret;
	}
	
	public static Foto FotoWithPrefs(SharedPreferences c, int pub, int pos, Publicidad p){
		Foto ret = new Foto();
		ret.pub = p;
		
		ret.lo = c.getString("item_"+pub+"_foto_"+pos+"_lo", "");
		ret.la = c.getString("item_"+pub+"_foto_"+pos+"_la", "");
		ret.bin = c.getString("item_"+pub+"_foto_"+pos+"_bin", "");
		ret.uploaded = c.getBoolean("item_"+pub+"_foto_"+pos+"_uploaded", false);
		ret.pos = pos;
		
		if (ret.bin!=""){
			ret.image = ret.base64ToBitmap(ret.bin);
		}
		return ret;
	}

	public void save(Context c, int pub) {
		SharedPreferences prefs = c.getSharedPreferences(Publicidad.PREFS_NAME, 0);
		SharedPreferences.Editor edit = prefs.edit();
		
		if (pos == -1){
			int items = prefs.getInt("item_"+pub+"_fotos", 0);
			pos = items+1;
			
			edit.putInt("item_"+pub+"_fotos", pos);
		}
		
		if (this.image!= null){
			this.bin = this.bitmapToBase64(this.image);
		}
		edit.putString("item_"+pub+"_foto_"+pos+"_lo", lo);
		edit.putString("item_"+pub+"_foto_"+pos+"_la", la);
		edit.putString("item_"+pub+"_foto_"+pos+"_bin", bin);
		edit.putBoolean("item_"+pub+"_foto_"+pos+"_uploaded", uploaded);
		edit.commit();
		
	}
	
	public void remove(Context c, int pub, int pos,Publicidad p) {
		if(this.pos!=-1)
		{
			SharedPreferences prefs = c.getSharedPreferences(Publicidad.PREFS_NAME, 0);
			SharedPreferences.Editor edit = prefs.edit();
			pos++;
			int items = prefs.getInt("item_"+pub+"_fotos", 0);

			Foto f=null;
			pos++;
			for(;pos<=items;pos++)
			{
				f=FotoWithPrefs(c.getSharedPreferences(Publicidad.PREFS_NAME, 0),pub,pos,p);
				edit.putString("item_"+pub+"_foto_"+(pos-1)+"_lo", f.lo);
				edit.putString("item_"+pub+"_foto_"+(pos-1)+"_la", f.la);
				edit.putString("item_"+pub+"_foto_"+(pos-1)+"_bin", f.bin);
				edit.putBoolean("item_"+pub+"_foto_"+(pos-1)+"_uploaded", f.uploaded);
			}
		
			edit.remove("item_"+pub+"_foto_"+items+"_lo");
			edit.remove("item_"+pub+"_foto_"+items+"_la");
			edit.remove("item_"+pub+"_foto_"+items+"_bin");
			edit.remove("item_"+pub+"_foto_"+items+"_uploaded");
		
			edit.putInt("item_"+pub+"_fotos", items-1);
		
			edit.commit();
		}
		
	}
	
	public void upload(final Publicidad p){
		RemoteModel.uploadFile(p, this,new UploadCallback(){

			@Override
			public void itemUploaded(String str) {
				Log.i("Image Upload Response", str);
				uploaded = true;
				p.save(Publicidad.context);
			}
		});
	}
	
	public static ArrayList<Foto> GetAllInv(SharedPreferences prefs, int inv, Inventory i){
		ArrayList<Foto> ret = new ArrayList<Foto>();

	    int items = prefs.getInt("inv_"+inv+"_fotos", 0);
	    for (int n = 1; n<=items; n++){
	    	ret.add(FotoWithPrefsInv(prefs,inv,n, i));
	    }
	    
	    return ret;
	}
	
	public static Foto FotoWithPrefsInv(SharedPreferences c, int inv, int pos, Inventory i){
		Foto ret = new Foto();
		ret.inv = i;
		
		ret.lo = c.getString("inv_"+inv+"_foto_"+pos+"_lo", "");
		ret.la = c.getString("inv_"+inv+"_foto_"+pos+"_la", "");
		ret.bin = c.getString("inv_"+inv+"_foto_"+pos+"_bin", "");
		ret.uploaded = c.getBoolean("inv_"+inv+"_foto_"+pos+"_uploaded", false);
		ret.pos = pos;
		
		if (ret.bin!=""){
			ret.image = ret.base64ToBitmap(ret.bin);
		}
		return ret;
	}

	public void saveInv(Context c, int inv) {
		SharedPreferences prefs = c.getSharedPreferences(Inventory.PREFS_NAME, 0);
		SharedPreferences.Editor edit = prefs.edit();
		
		if (pos == -1){
			int items = prefs.getInt("inv_"+inv+"_fotos", 0);
			pos = items+1;
			
			edit.putInt("inv_"+inv+"_fotos", pos);
		}
		
		if (this.image!= null){
			this.bin = this.bitmapToBase64(this.image);
		}
		edit.putString("inv_"+inv+"_foto_"+pos+"_lo", lo);
		edit.putString("inv_"+inv+"_foto_"+pos+"_la", la);
		edit.putString("inv_"+inv+"_foto_"+pos+"_bin", bin);
		edit.putBoolean("inv_"+inv+"_foto_"+pos+"_uploaded", uploaded);
		edit.commit();
		
	}
	
	public void removeInv(Context c, int inv, int pos,Inventory i) {
		if(this.pos!=-1)
		{
			SharedPreferences prefs = c.getSharedPreferences(Inventory.PREFS_NAME, 0);
			SharedPreferences.Editor edit = prefs.edit();
			pos++;
			int items = prefs.getInt("inv_"+inv+"_fotos", 0);

			Foto f=null;
			pos++;
			for(;pos<=items;pos++)
			{
				f=FotoWithPrefsInv(c.getSharedPreferences(Inventory.PREFS_NAME, 0),inv,pos,i);
				edit.putString("inv_"+inv+"_foto_"+(pos-1)+"_lo", f.lo);
				edit.putString("inv_"+inv+"_foto_"+(pos-1)+"_la", f.la);
				edit.putString("inv_"+inv+"_foto_"+(pos-1)+"_bin", f.bin);
				edit.putBoolean("inv_"+inv+"_foto_"+(pos-1)+"_uploaded", f.uploaded);
			}
		
			edit.remove("inv_"+inv+"_foto_"+items+"_lo");
			edit.remove("inv_"+inv+"_foto_"+items+"_la");
			edit.remove("inv_"+inv+"_foto_"+items+"_bin");
			edit.remove("inv_"+inv+"_foto_"+items+"_uploaded");
		
			edit.putInt("inv_"+inv+"_fotos", items-1);
		
			edit.commit();
		}
		
	}
	
	public void uploadInv(final Inventory i){
		RemoteModel.uploadFileInv(i, this,new UploadCallback(){

			@Override
			public void itemUploaded(String str) {
				Log.i("Image Upload Response", str);
				uploaded = true;
				i.save(Inventory.context);
			}
		});
	}
}