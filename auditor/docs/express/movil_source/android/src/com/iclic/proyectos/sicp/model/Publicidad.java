package com.iclic.proyectos.sicp.model;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.SharedPreferences;
import android.location.Location;
import android.util.Log;
import android.widget.Toast;

import com.iclic.proyectos.sicp.ProveedorActivity;
import com.iclic.proyectos.sicp.remotemodel.RemoteModel;
import com.loopj.android.http.AsyncHttpResponseHandler;

public class Publicidad {
	public static final String PREFS_NAME = "PublicidadData";
	
	public int pos=-1;
	
	public String pubId="";
	public String details="";
	public String type="";
	
	
	public String lo,la;
	public long timestamp;

	public String extId;
	boolean uploaded = false;
	public ArrayList<Foto> fotos;
	
	public Publicidad(){
		fotos = new ArrayList<Foto>();
		if (lastLocation!= null){
			lo =  String.valueOf( lastLocation.getLongitude());
			la =  String.valueOf( lastLocation.getLatitude());
		}
		timestamp =  System.currentTimeMillis()/1000;
	}
	
	public static Location lastLocation;
	
	public Publicidad(String pubId){
		this.pubId=pubId;
		fotos = new ArrayList<Foto>();
		if (lastLocation!= null){
			lo =  String.valueOf( lastLocation.getLongitude());
			la =  String.valueOf( lastLocation.getLatitude());
		}
		timestamp =  System.currentTimeMillis()/1000;
	}
	
	

	public String toString() {
		return pubId;
	}
	
	public static Context context = null;
	
	public void save(Context c) {
		context = c;
		SharedPreferences prefs = c.getSharedPreferences(PREFS_NAME, 0);
		saveWithPreferences(prefs);
		
		
	}
	private void saveWithPreferences(SharedPreferences prefs){
		SharedPreferences.Editor edit = prefs.edit();
		setPreferences(prefs);
		
		if (pos == -1){
			int items = prefs.getInt("item_sum", 0);
			pos = items+1;
			
			edit.putInt("item_sum", pos);
		}
		edit.putString("item_"+pos+"_pubid", pubId);
		edit.putString("item_"+pos+"_desc", details);
		edit.putString("item_"+pos+"_lo", lo);
		edit.putString("item_"+pos+"_la", la);
		edit.putLong("item_"+pos+"_timestamp", timestamp);
		edit.putString("item_"+pos+"_status", type);
		edit.putBoolean("item_"+pos+"_uploaded", uploaded);
		edit.putString("item_"+pos+"_extid", extId);
		edit.putInt("item_"+pos+"_photo", fotos.size());
		edit.commit();
		
		for (int n = 0; n<fotos.size(); n++){
			fotos.get(n).save(context,pos);
		}		
	}
	
	public void removePic(Context c,Foto f)
	{
		int pos=0;
		if(fotos.contains(f))
		{
			for(Foto p:fotos)
			{
				if(p.equals(f))
				{
					if(this.pos!=-1)
					{
						fotos.get(pos).remove(c,this.pos, pos, this);
					}
					fotos.remove(f);
					break;
				}
				pos++;
			}
		}
	}
	
	public static void updatePub(String pubId,String type, Context c)
	{
		SharedPreferences sh=c.getSharedPreferences(PREFS_NAME, 0);
		SharedPreferences.Editor edit = sh.edit();
		int total=sh.getInt("item_sum", 0);
		for(int i=1;i<=total;i++)
		{
			if(pubId.equals(sh.getString("item_"+i+"_pubid","")))
			{
				if(!sh.getString("item_"+i+"_status", "").equals("Pendiente"))
					edit.putString("item_"+i+"_status", type);
			}
		}
		edit.commit();
	}
	
	public static ArrayList<Publicidad> GetAll(Context c){
		
		SharedPreferences prefs = c.getSharedPreferences(PREFS_NAME, 0);
		
		ArrayList<Publicidad> ret = new ArrayList<Publicidad>();
	    int items = prefs.getInt("item_sum", 0);
	    for (int n = 1; n<=items; n++){
	    	ret.add(PublicidadWithPrefs(prefs,n));
	    }
	    
	    return ret;
	}
	
public static boolean thereLocally (Context c,String code){
		
		SharedPreferences prefs = c.getSharedPreferences(PREFS_NAME, 0);
		
	    int items = prefs.getInt("item_sum", 0);
	    for (int n = 1; n<=items; n++){
	    	if(code.equals(prefs.getString("item_"+n+"_pubid", "")))
	    		return true;
	    }
	    
	    return false;
	}
	
	public static Publicidad PublicidadWithPrefs(SharedPreferences c, int pos){
		setPreferences(c);
		Publicidad ret = new Publicidad();
		
		ret.pubId = c.getString("item_"+pos+"_pubid", "");
		ret.details = c.getString("item_"+pos+"_desc", "");
		ret.lo = c.getString("item_"+pos+"_lo", "");
		ret.la = c.getString("item_"+pos+"_la", "");
		ret.timestamp = c.getLong("item_"+pos+"_timestamp", 0);
		ret.type = c.getString("item_"+pos+"_status", "");
		ret.uploaded = c.getBoolean("item_"+pos+"_uploaded", false);
		ret.extId = c.getString("item_"+pos+"_extid", "");
		ret.fotos = Foto.GetAll(c, pos, ret);
		
		ret.pos = pos;
		return ret;
	}

	public void upload() {
		Log.i("Publicidad", "cargando");
		if (!uploaded && fotos.size()>=3){
			RemoteModel.uploadLocationReport(this,new AsyncHttpResponseHandler(){
				@Override
				public void onSuccess(String response) {
					
					
					try {
						Log.i("Inserting Report",response);
						JSONObject o = new JSONObject(response);
						extId = o.getString("id");
						uploaded = true;
						upload_photos(response);
						type="Bien";
						saveWithPreferences(preferences);
						ProveedorActivity.updateRow(pos);
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
					
				}
			});
		}else if(!this.extId.equals("")){
			upload_photos(this.extId);
		}
	}
	
	private void upload_photos(String realid){
		for (Foto f: this.fotos){
			if(!f.uploaded){
				f.upload(this);
			}
		}
	}
	
	public static Boolean validId(SharedPreferences p, String id){
		Boolean sino = false;
		
		int size = p.getInt("location_count", 0);
		for (int n = 0; n<size; n++){
			String str = p.getString("location_"+n, "");
			Log.i("test", str);
			if (str.equals(id)){
				sino = true;
			}
		}
		return sino;
	}
	
	public static void uploadAll(final Context c){
		
		RemoteModel.getLocations(new AsyncHttpResponseHandler(){
				@Override
				public void onSuccess(String response) {
					try {
						JSONObject o = new JSONObject(response);
						String code = o.getString("code");
						if (code.equals("0")){
							SharedPreferences prefs = c.getSharedPreferences(PREFS_NAME, 0);
							SharedPreferences.Editor edit = prefs.edit();
							
							JSONArray arr = o.getJSONArray("data");
							edit.putInt("location_count", arr.length());
							for (int n = 0; n< arr.length(); n++){
								JSONObject ob = arr.getJSONObject(n);
								edit.putString("location_"+(n),ob.getString("code"));
							}
							
							edit.commit();
						}
						
						
						Log.i("Locations", response);
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
					
				}
		});
		Toast.makeText(c, "Sincronizando", Toast.LENGTH_LONG).show();
		ArrayList<Publicidad> all = GetAll(c);
		for (Publicidad p :all){
			p.upload();
		}
		
	}
	
	private static SharedPreferences preferences;
	public static void setPreferences(SharedPreferences p){
		if (p!= null){
			preferences = p;
		}
	}
	
	public static String getUserTokenFromDB(){
		String logininfo = preferences.getString("loginInformation", "");
		try {
			JSONObject o = new JSONObject(logininfo);
			String t = o.getString("token");
			Log.i("log", "El token es: "+t);
			return t;
			//openRole(role);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}

}