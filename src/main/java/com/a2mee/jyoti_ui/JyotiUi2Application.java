package com.a2mee.jyoti_ui;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.time.LocalDate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;



@SpringBootApplication
public class JyotiUi2Application {

	public static void main(String[] args) {
		SpringApplication.run(JyotiUi2Application.class, args);
		
		/*InetAddress ip;
		try {
			
			
			ip = InetAddress.getLocalHost();
			NetworkInterface network = NetworkInterface.getByInetAddress(ip);

			byte[] mac = network.getHardwareAddress();
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < mac.length; i++) {
				sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));
			}
			//System.out.println("MAC:: "+sb);
			//String licekceKey ="00-15-5D-AF-DB-0A";//Jyoti Server 
			String licekceKey ="24-41-8C-8F-BE-75";
			if(licekceKey.equalsIgnoreCase(sb.toString())){
			//	LocalDate curdate = LocalDate.now();
				//LocalDate hardcodedDate = LocalDate.parse("2020-06-24");
					
					
					if (hardcodedDate.compareTo(curdate)>=0){
						System.out.println("Licence Valid");
						SpringApplication.run(Application.class, args);
						
					}else{
						
						System.out.println("Licence Exprided ::Contact Dattatray Bodhae");
						System.exit(0);
					}
				
				
				SpringApplication.run(JyotiUi2Application.class, args);


			}else{
				System.out.println("Invalid Licencce :: Please Contact Appoint 2 meee ,Pune");

				System.exit(0);
				
			}
		} catch (UnknownHostException e) {

			e.printStackTrace();

		} catch (SocketException e){

			e.printStackTrace();

		}
*/
	}

}
